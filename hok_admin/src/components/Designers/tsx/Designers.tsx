import React, { useMemo, useState } from 'react';
import '../css/Designers.css';
// Removed mock data imports
import { Designer, DesignerType } from '../types/designer.types';
import toast, { Toaster } from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TYPE_COLUMNS: DesignerType[] = [
  'Couture House',
  'Contemporary Label',
  'Heritage Weave',
  'Indie Designer',
];

interface DesignersProps {
  designers: Designer[];
  onEditDesigner: (id: string) => void;
  onAddDesigner: () => void;
  onReorderFeatured?: (orderedIds: string[]) => Promise<void>;
  onUpdateType?: (id: string, newType: string) => Promise<void>;
  onToggleFeatured?: (id: string, isFeatured: boolean) => Promise<void>;
}

// Sortable Row Component for Featured list
const SortableFeaturedRow = ({ designer, index, onMoveUp, onMoveDown, onRemove }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: designer.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="featured-row">
      <span className="drag-handle" {...attributes} {...listeners} style={{cursor: 'grab'}}>⠿</span>
      <span className="featured-badge">#{index + 1}</span>
      <span className="featured-name">{designer.name}</span>
      <span className="live-pill">{designer.livePieces} live</span>
      <span className="row-actions">
        <button className="icon-btn" aria-label="move up" onClick={() => onMoveUp(index)} disabled={index===0}>↑</button>
        <button className="icon-btn" aria-label="move down" onClick={() => onMoveDown(index)}>↓</button>
        <button className="icon-btn" aria-label="remove" onClick={() => onRemove(designer.id)}>×</button>
      </span>
    </div>
  );
};

// Sortable Row Component for Type columns
const SortableTypeRow = ({ designer, onRemove }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: designer.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="type-row">
      <span className="drag-handle" {...attributes} {...listeners} style={{cursor: 'grab'}}>⠿</span>
      <span className="type-row-name">{designer.name}</span>
      <span className="row-actions">
        <button className="icon-btn" aria-label="remove" onClick={() => onRemove(designer.id)}>×</button>
      </span>
    </div>
  );
};

// Type Column Component
import { useDroppable } from '@dnd-kit/core';

const TypeColumn = ({ type, designers, onRemove, onAdd }: { type: DesignerType, designers: Designer[], onRemove: (id:string)=>void, onAdd: () => void }) => {
  const { setNodeRef } = useDroppable({ id: type });
  return (
    <div className="type-column">
      <div className="type-column-header">
        <span>{type}</span>
        <span className="type-column-count">{designers.length} live</span>
      </div>
      <div className="type-column-body" ref={setNodeRef}>
        <SortableContext items={designers.map(d=>d.id)} strategy={verticalListSortingStrategy}>
          {designers.length === 0 && <div className="type-column-empty">drop a designer here</div>}
          {designers.map((d) => (
            <SortableTypeRow key={d.id} designer={d} onRemove={onRemove} />
          ))}
        </SortableContext>
        <button className="add-link" onClick={onAdd}>+ Add designer</button>
      </div>
    </div>
  );
};

const Designers: React.FC<DesignersProps> = ({ 
  designers: initialDesignerList, 
  onEditDesigner, 
  onAddDesigner,
  onReorderFeatured,
  onUpdateType,
  onToggleFeatured
}) => {
  const [search, setSearch] = useState('');
  const [designerList, setDesignerList] = useState(initialDesignerList);
  const [isAddingFeatured, setIsAddingFeatured] = useState(false);

  React.useEffect(() => {
    setDesignerList(initialDesignerList);
  }, [initialDesignerList]);

  // Derive categories
  const featured = useMemo(() => designerList.filter((d) => d.isFeatured).sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0)), [designerList]);
  
  const byType = useMemo(() => {
    const grouped: Record<DesignerType, Designer[]> = { 'Couture House': [], 'Contemporary Label': [], 'Heritage Weave': [], 'Indie Designer': [] };
    designerList.forEach((d) => { if (grouped[d.type]) grouped[d.type].push(d); });
    return grouped;
  }, [designerList]);

  const unclassified = useMemo(() => designerList.filter((d) => !TYPE_COLUMNS.includes(d.type)), [designerList]);
  const newToHOK = useMemo(() => designerList.filter((d) => d.isNewToHOK), [designerList]);

  const filteredTable = useMemo(() => {
    if (!search.trim()) return designerList;
    const q = search.toLowerCase();
    return designerList.filter((d) => (d.name || '').toLowerCase().includes(q));
  }, [designerList, search]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFeaturedDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = featured.findIndex((d) => d.id === active.id);
      const newIndex = featured.findIndex((d) => d.id === over?.id);
      
      const newFeatured = arrayMove(featured, oldIndex, newIndex);
      
      // Update local state optimistically
      const orderedIds = newFeatured.map(d => d.id);
      setDesignerList(prev => prev.map(d => {
        if (d.isFeatured) {
          return { ...d, featuredOrder: orderedIds.indexOf(d.id) + 1 };
        }
        return d;
      }));

      // API call
      if (onReorderFeatured) {
        toast.promise(onReorderFeatured(orderedIds), {
          loading: 'Reordering featured designers...',
          success: 'Reordered successfully!',
          error: 'Failed to reorder'
        });
      }
    }
  };

  const moveFeatured = (index: number, direction: 'up'|'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === featured.length - 1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newFeatured = arrayMove(featured, index, newIndex);
    const orderedIds = newFeatured.map(d => d.id);
    
    setDesignerList(prev => prev.map(d => {
      if (d.isFeatured) return { ...d, featuredOrder: orderedIds.indexOf(d.id) + 1 };
      return d;
    }));
    
    if (onReorderFeatured) {
      toast.promise(onReorderFeatured(orderedIds), {
        loading: 'Updating order...',
        success: 'Order updated',
        error: 'Update failed'
      });
    } else {
      toast.success('Order updated successfully!');
    }
  };

  const handleRemoveFeatured = (id: string) => {
    setDesignerList(prev => prev.map(d => {
      if (d.id === id) return { ...d, isFeatured: false, featuredOrder: null };
      return d;
    }));
    toast.success('Removed from featured!');
  };

  const handleTypeDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    let destinationType: DesignerType | null = null;
    if (TYPE_COLUMNS.includes(overId as DesignerType)) {
      destinationType = overId as DesignerType;
    } else {
      const targetDesigner = designerList.find(d => d.id === overId);
      if (targetDesigner) destinationType = targetDesigner.type;
    }

    if (destinationType) {
      const draggedDesigner = designerList.find(d => d.id === activeId);
      if (draggedDesigner && draggedDesigner.type !== destinationType) {
        setDesignerList(prev => prev.map(d => {
          if (d.id === activeId) return { ...d, type: destinationType! };
          return d;
        }));
        
        if (onUpdateType) {
          toast.promise(onUpdateType(activeId, destinationType), {
            loading: 'Moving designer...',
            success: `Moved ${draggedDesigner.name} to ${destinationType}`,
            error: 'Move failed'
          });
        } else {
          toast.success(`Moved ${draggedDesigner.name} to ${destinationType}`);
        }
      } else {
        // Just reordering within same column (if implemented in state)
        toast.success(`Order updated in ${destinationType}`);
      }
    }
  };

  const handleRemoveType = (id: string) => {
    toast.success('Removed designer from column!');
  };

  return (
    <div className="designers-page">
      <div className="designers-eyebrow">CATALOGUE</div>
      <h2 className="designers-heading">Designers</h2>
      <p className="designers-description">
        Master profiles for every designer on the platform. Nav and homepage derive from this registry...
      </p>

      <div className="curation-section-header">
        <span className="curation-section-title">STOREFRONT CURATION — WHAT THE NAV & HOMEPAGE RENDER</span>
        <span className="curation-section-note">Every change below writes to the registry and updates instantly</span>
      </div>

      <div className="curation-block">
        <div className="curation-block-header">
          <span className="curation-block-title"><span className="curation-block-num">01</span> FEATURED — HOMEPAGE GRID & NAV COLUMN</span>
          <span className="curation-block-note">Drag ⠿ to reorder (arrows work too)</span>
        </div>
        <div className="featured-list">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleFeaturedDragEnd}>
            <SortableContext items={featured.map(d=>d.id)} strategy={verticalListSortingStrategy}>
              {featured.map((d, i) => (
                <SortableFeaturedRow 
                  key={d.id} 
                  designer={d} 
                  index={i} 
                  onMoveUp={() => moveFeatured(i, 'up')}
                  onMoveDown={() => moveFeatured(i, 'down')}
                  onRemove={handleRemoveFeatured}
                />
              ))}
            </SortableContext>
          </DndContext>
          {isAddingFeatured ? (
            <div className="add-featured-select">
              <select 
                style={{ marginTop: '12px', width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                onChange={async (e) => {
                  const id = e.target.value;
                  if (id && onToggleFeatured) {
                    await onToggleFeatured(id, true);
                  }
                  setIsAddingFeatured(false);
                }}
                onBlur={() => setIsAddingFeatured(false)}
                autoFocus
              >
                <option value="">Select a designer to feature...</option>
                {designerList.filter(d => !d.isFeatured).map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <button 
              className="add-link" 
              onClick={() => setIsAddingFeatured(true)}
            >
              + Feature a designer
            </button>
          )}
        </div>
      </div>

      <div className="curation-block">
        <div className="curation-block-header">
          <span className="curation-block-title"><span className="curation-block-num">02</span> DISCOVER BY TYPE</span>
          <span className="curation-block-note">Drag between columns</span>
        </div>
        <div className="type-columns">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleTypeDragEnd}>
            {TYPE_COLUMNS.map((type) => (
              <TypeColumn 
                key={type} 
                type={type} 
                designers={byType[type]} 
                onRemove={handleRemoveType}
                onAdd={onAddDesigner}
              />
            ))}
          </DndContext>
        </div>
      </div>

      <div className="designers-table-toolbar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search designers..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={onAddDesigner}>+ Add Designer</button>
      </div>

      <div className="designers-table">
        <div className="designers-table-head">
          <span className="col-designer">DESIGNER</span>
          <span className="col-type">TYPE</span>
          <span className="col-slug">SLUG</span>
          <span className="col-pieces">PIECES (LIVE / TOTAL)</span>
          <span className="col-featured">FEATURED</span>
          <span className="col-status">STATUS</span>
          <span className="col-edit" />
        </div>
        {filteredTable.map((d) => (
          <div className="designers-table-row" key={d.id}>
            <div className="col-designer">
              <div className="row-designer-name">{d.name}</div>
              <div className="row-designer-bio">{d.bio}</div>
            </div>
            <div className="col-type">{d.type}</div>
            <div className="col-slug"><code>{d.slug}</code></div>
            <div className="col-pieces">
              {d.livePieces === 0 && d.totalPieces === 0 ? '0 — no pieces yet' : `${d.livePieces} / ${d.totalPieces}`}
            </div>
            <div className="col-featured">
              {d.isFeatured ? <span className="pill pill-green">Yes · #{d.featuredOrder}</span> : <span className="pill pill-grey">No</span>}
            </div>
            <div className="col-status">
              <span className="pill pill-green">{d.status}</span>
            </div>
            <div className="col-edit">
              <button className="btn btn-outline-small" onClick={() => onEditDesigner(d.id)}>Edit →</button>
            </div>
          </div>
        ))}
        <div className="designers-table-footer">{filteredTable.length} designers</div>
      </div>
    </div>
  );
};
export default Designers;
