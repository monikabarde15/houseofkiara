/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AnswersWorkspaceView (Spec §7.8, Screens 26, 27, 38)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState, useMemo } from 'react';
import { PageCardData } from '../types/pages.types';
import { AnswerItem } from '../types/answers.types';
import { getPageAnswers } from '../data/pageAnswersRegistry';
import { AnswersHeaderStrip } from './AnswersHeaderStrip';
import { AnswersListSidebar } from './AnswersListSidebar';
import { AnswersPaperCanvas } from './AnswersPaperCanvas';
import { AnswerSettingsPanel } from './AnswerSettingsPanel';
import { ParagraphPickerModal } from './ParagraphPickerModal';

interface AnswersWorkspaceViewProps {
  page: PageCardData;
  onBackToPaperView: () => void;
  onBackToAllPages: () => void;
}

export const AnswersWorkspaceView: React.FC<AnswersWorkspaceViewProps> = ({
  page,
  onBackToPaperView,
  onBackToAllPages
}) => {
  const [answers, setAnswers] = useState<AnswerItem[]>(() => getPageAnswers(page.slug));
  const [selectedAnswerId, setSelectedAnswerId] = useState<string>(() => {
    const list = getPageAnswers(page.slug);
    return list[0]?.id || '';
  });
  const [pickerOpen, setPickerOpen] = useState(false);

  const selectedAnswer = useMemo(() => {
    return answers.find(a => a.id === selectedAnswerId) || answers[0];
  }, [answers, selectedAnswerId]);

  const availableSections = useMemo(() => {
    const set = new Set<string>();
    answers.forEach(a => set.add(a.section));
    return Array.from(set);
  }, [answers]);

  const sectionAnswers = useMemo(() => {
    return answers.filter(a => a.section === selectedAnswer?.section);
  }, [answers, selectedAnswer]);

  const currentIndex = sectionAnswers.findIndex(a => a.id === selectedAnswer?.id) + 1;

  const handleMove = (direction: 'up' | 'down') => {
    const idx = answers.findIndex(a => a.id === selectedAnswerId);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= answers.length) return;
    const updated = [...answers];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    setAnswers(updated);
  };

  const handleDuplicate = () => {
    if (!selectedAnswer) return;
    const duplicated: AnswerItem = {
      ...selectedAnswer,
      id: `ans_${Date.now()}`,
      question: `${selectedAnswer.question} (Copy)`,
      linkName: `${selectedAnswer.linkName}-copy`,
      paragraphs: selectedAnswer.paragraphs.map(p => ({ ...p, id: `p_${Date.now()}_${Math.random()}` }))
    };
    setAnswers(prev => [...prev, duplicated]);
    setSelectedAnswerId(duplicated.id);
  };

  const handleDelete = () => {
    if (!selectedAnswer) return;
    const remaining = answers.filter(a => a.id !== selectedAnswer.id);
    setAnswers(remaining);
    if (remaining.length > 0) setSelectedAnswerId(remaining[0].id);
  };

  const handleAddQuestion = () => {
    const newQuestion: AnswerItem = {
      id: `ans_${Date.now()}`,
      question: 'New question title',
      section: selectedAnswer?.section || 'Cancelling a rental',
      side: 'both',
      orderIndex: answers.length + 1,
      linkName: `new-question-${Date.now().toString().slice(-4)}`,
      paragraphs: [
        {
          id: `p_${Date.now()}`,
          kind: 'paragraph',
          text: 'Write the answer paragraph the way a customer reads it.'
        }
      ]
    };
    setAnswers(prev => [newQuestion, ...prev]);
    setSelectedAnswerId(newQuestion.id);
  };

  const handleAddParagraph = (answerId: string, kind: 'paragraph' | 'bullet') => {
    setAnswers(prev =>
      prev.map(a =>
        a.id === answerId
          ? {
              ...a,
              paragraphs: [
                ...a.paragraphs,
                { id: `p_${Date.now()}`, kind, text: kind === 'bullet' ? 'New bullet point' : 'New paragraph explanation' }
              ]
            }
          : a
      )
    );
  };

  const handleUpdateParagraph = (answerId: string, pId: string, newText: string) => {
    setAnswers(prev =>
      prev.map(a =>
        a.id === answerId
          ? { ...a, paragraphs: a.paragraphs.map(p => (p.id === pId ? { ...p, text: newText } : p)) }
          : a
      )
    );
  };

  const handleDetachShared = (answerId: string, pId: string) => {
    setAnswers(prev =>
      prev.map(a =>
        a.id === answerId
          ? { ...a, paragraphs: a.paragraphs.map(p => (p.id === pId ? { ...p, sharedFrom: undefined } : p)) }
          : a
      )
    );
  };

  const handleUseSharedParagraph = (pageName: string, questionTitle: string, text: string) => {
    if (!selectedAnswer) return;
    const newShared = {
      id: `p_${Date.now()}`,
      kind: 'paragraph' as const,
      text,
      sharedFrom: { pageName, questionTitle }
    };
    setAnswers(prev =>
      prev.map(a =>
        a.id === selectedAnswer.id ? { ...a, paragraphs: [...a.paragraphs, newShared] } : a
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f2ea] text-[#1a1612]">
      {/* 1. Header Strip (Spec §7.8) */}
      <AnswersHeaderStrip
        page={page}
        answersCount={answers.length}
        onBackToPaperView={onBackToPaperView}
        onBackToAllPages={onBackToAllPages}
      />

      {/* 2. Three Column Desk Layout (Spec §7.8, Screen 26) */}
      <main className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: 300 px Question List */}
        <AnswersListSidebar
          answers={answers}
          selectedAnswerId={selectedAnswerId}
          onSelectAnswer={setSelectedAnswerId}
          onAddQuestion={handleAddQuestion}
        />

        {/* Middle: Paper Desk */}
        {selectedAnswer && (
          <AnswersPaperCanvas
            answers={answers}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={setSelectedAnswerId}
            onUpdateParagraph={handleUpdateParagraph}
            onAddParagraph={handleAddParagraph}
            onDetachSharedParagraph={handleDetachShared}
            onOpenParagraphPicker={() => setPickerOpen(true)}
          />
        )}

        {/* Right: 384 px Answer Settings */}
        {selectedAnswer && (
          <div className="w-full lg:w-[384px] shrink-0 sticky top-36">
            <AnswerSettingsPanel
              answer={selectedAnswer}
              totalInSection={sectionAnswers.length}
              currentIndexInSection={currentIndex}
              availableSections={availableSections}
              onUpdateAnswer={updated =>
                setAnswers(prev => prev.map(a => (a.id === updated.id ? updated : a)))
              }
              onMoveEarlier={() => handleMove('up')}
              onMoveLater={() => handleMove('down')}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>

      {/* Paragraph Picker Modal */}
      {pickerOpen && (
        <ParagraphPickerModal
          currentAnswerId={selectedAnswerId}
          onSelectParagraph={handleUseSharedParagraph}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
};

export default AnswersWorkspaceView;
