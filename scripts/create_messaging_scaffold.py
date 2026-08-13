from pathlib import Path

root = Path('src/components/Messaging')

css_files = [
    'styles/variables.css',
    'components/styles/MessagingHeader.css',
    'components/styles/StatTiles.css',
    'components/styles/TabBar.css',
    'components/styles/Card.css',
    'components/styles/Table.css',
    'components/styles/Toolbar.css',
    'components/styles/Button.css',
    'components/styles/Toggle.css',
    'components/styles/Pill.css',
    'components/styles/Chip.css',
    'components/styles/FormField.css',
    'components/styles/NoteBar.css',
    'tabs/styles/MessagesTab.css',
    'tabs/styles/EditorTab.css',
    'tabs/styles/SendTab.css',
    'tabs/styles/SendLogTab.css',
    'tabs/styles/SettingsTab.css',
    'messages/styles/ProblemBanner.css',
    'messages/styles/MessagesTable.css',
    'messages/styles/MessagesRow.css',
    'messages/styles/MessagesToolbar.css',
    'messages/styles/MessagesFooter.css',
    'messages/styles/GroupHeading.css',
    'editor/styles/EditorHeader.css',
    'editor/styles/EditorMessageCard.css',
    'editor/styles/EditorWordingCard.css',
    'editor/styles/WordingBar.css',
    'editor/styles/WordingFields.css',
    'editor/styles/VariableChips.css',
    'editor/styles/WordGroupChips.css',
    'editor/styles/EmailPreview.css',
    'editor/styles/WhatsAppPreview.css',
    'editor/styles/AttachmentStrip.css',
    'editor/styles/AttachmentList.css',
    'editor/styles/AttachmentPicker.css',
    'send/styles/SendNoteBar.css',
    'send/styles/SendMessageCard.css',
    'send/styles/SendPeopleCard.css',
    'send/styles/SendReadBackCard.css',
    'send/styles/MessageSelect.css',
    'send/styles/WordingSelect.css',
    'send/styles/AboutSelect.css',
    'send/styles/QuickLists.css',
    'send/styles/PeopleList.css',
    'send/styles/PeopleRow.css',
    'send/styles/SendCardItem.css',
    'sendlog/styles/SendLogToolbar.css',
    'sendlog/styles/SendLogTable.css',
    'sendlog/styles/SendLogRow.css',
    'sendlog/styles/SendLogFooter.css',
    'settings/styles/SettingsSenderCard.css',
    'settings/styles/SettingsAppearanceCard.css',
    'settings/styles/SettingsTypeCard.css',
    'settings/styles/SettingsDocumentsCard.css',
    'settings/styles/SettingsRulesCard.css',
    'settings/styles/SettingsWordsCard.css',
    'modals/styles/DocumentViewer.css',
    'modals/styles/ConfirmModal.css',
    'MessagingView.css',
]

component_files = [
    'components/MessagingHeader.tsx',
    'components/StatTiles.tsx',
    'components/TabBar.tsx',
    'components/Card.tsx',
    'components/Table.tsx',
    'components/Toolbar.tsx',
    'components/Button.tsx',
    'components/Toggle.tsx',
    'components/Pill.tsx',
    'components/Chip.tsx',
    'components/FormField.tsx',
    'components/NoteBar.tsx',
    'tabs/MessagesTab.tsx',
    'tabs/EditorTab.tsx',
    'tabs/SendTab.tsx',
    'tabs/SendLogTab.tsx',
    'tabs/SettingsTab.tsx',
    'messages/ProblemBanner.tsx',
    'messages/MessagesTable.tsx',
    'messages/MessagesRow.tsx',
    'messages/MessagesToolbar.tsx',
    'messages/MessagesFooter.tsx',
    'messages/GroupHeading.tsx',
    'editor/EditorHeader.tsx',
    'editor/EditorMessageCard.tsx',
    'editor/EditorWordingCard.tsx',
    'editor/WordingBar.tsx',
    'editor/WordingFields.tsx',
    'editor/VariableChips.tsx',
    'editor/WordGroupChips.tsx',
    'editor/EmailPreview.tsx',
    'editor/WhatsAppPreview.tsx',
    'editor/AttachmentStrip.tsx',
    'editor/AttachmentList.tsx',
    'editor/AttachmentPicker.tsx',
    'send/SendNoteBar.tsx',
    'send/SendMessageCard.tsx',
    'send/SendPeopleCard.tsx',
    'send/SendReadBackCard.tsx',
    'send/MessageSelect.tsx',
    'send/WordingSelect.tsx',
    'send/AboutSelect.tsx',
    'send/QuickLists.tsx',
    'send/PeopleList.tsx',
    'send/PeopleRow.tsx',
    'send/SendCardItem.tsx',
    'sendlog/SendLogToolbar.tsx',
    'sendlog/SendLogTable.tsx',
    'sendlog/SendLogRow.tsx',
    'sendlog/SendLogFooter.tsx',
    'settings/SettingsSenderCard.tsx',
    'settings/SettingsAppearanceCard.tsx',
    'settings/SettingsTypeCard.tsx',
    'settings/SettingsDocumentsCard.tsx',
    'settings/SettingsRulesCard.tsx',
    'settings/SettingsWordsCard.tsx',
    'modals/DocumentViewer.tsx',
    'modals/ConfirmModal.tsx',
    'MessagingView.tsx',
]

service_and_hook_files = [
    'hooks/useMessages.ts',
    'hooks/useMessageDetail.ts',
    'hooks/useMessageActions.ts',
    'hooks/useWording.ts',
    'hooks/useSend.ts',
    'hooks/useSendLog.ts',
    'services/messageService.ts',
    'services/sendService.ts',
    'services/exportService.ts',
    'types/messaging.types.ts',
    'utils/constants.ts',
    'utils/formatter.ts',
    'utils/validators.ts',
    'utils/generators.ts',
    'utils/templates.ts',
    'data/mockMessages.ts',
]

# Build requested tree
for rel in css_files:
    p = root / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text('', encoding='utf-8')

for rel in component_files:
    p = root / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    name = p.stem
    p.write_text(
        "import React from 'react';\n\n"
        f"const {name}: React.FC = () => {{\n"
        "  return <div />;\n"
        "};\n\n"
        f"export default {name};\n",
        encoding='utf-8'
    )

for rel in service_and_hook_files:
    p = root / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text("export const placeholder = null;\n", encoding='utf-8')

print('Created messaging scaffold:', root)
