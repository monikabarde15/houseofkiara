// utils/alerts.ts

export const ALERTS = {
  // Removing a message that has been sent
  REMOVE_SENT_MESSAGE: (count: number) => 
    `This message has been sent ${count} times, so it stays. Switch its channels off instead and it will stop going out while the record of what was already sent survives.`,

  // Removing a built-in message
  REMOVE_BUILTIN_MESSAGE: 
    `This is one of the messages the platform sends on its own, so it cannot be removed. Switch its channels off if you do not want it going out.`,

  // Crossing off a tax document
  CROSS_TAX_DOCUMENT: (document: string) =>
    `${document} cannot be turned off. It is a tax document, and whether it goes is decided by law rather than by us. If it genuinely should not apply here, open it under Setup → Documents and change which messages carry it.`,

  // Dropping a tax document from one send
  DROP_TAX_DOCUMENT: (document: string) =>
    `${document} cannot be dropped from a single send. It is a tax document.`,

  // Attaching a tax document by hand
  ATTACH_TAX_DOCUMENT: (document: string) =>
    `${document} is a tax document. Whether it travels is decided by the rule for it under Setup → Documents, not attached by hand.`,

  // Switching off a Required channel
  SWITCH_OFF_REQUIRED: 
    `This one is marked Required, so email stays on. It carries money, a deposit, a security fact or something the law asks for. If it really should be optional, change that in the editor first, on the message itself.`,

  // Removing the last wording
  REMOVE_LAST_WORDING: 
    `A message needs at least one wording.`,

  // Duplicate wording name
  DUPLICATE_WORDING_NAME: (name: string) =>
    `There is already a wording called "${name}". Give this one a different name.`,

  // Saving a word the message cannot fill in
  WORD_CANNOT_FILL: (word: string) =>
    `Not saved yet. This message uses {{${word}}}, which it has no way to fill in. Either take those out, or tick the word-group they belong to above.`,

  // Unticking a word-group still in use
  WORD_GROUP_IN_USE: (word: string, group: string) =>
    `The wording still uses {{${word}}} from this group. Take those out first, then untick it.`,

  // Email on with nothing written
  EMAIL_ON_NOTHING_WRITTEN: 
    `Email is switched on but nothing is written. Write it, or switch email off first.`,

  // Message with no name
  MESSAGE_NO_NAME: 
    `Give the message a name so the team can find it.`,

  // Sending a promotion message with no code
  PROMOTION_NO_CODE: 
    `This message quotes a promotion, so pick one above. Otherwise the code would come out blank.`,

  // Sending with nobody chosen
  SEND_NOBODY_CHOSEN: 
    `Choose who it is going to first.`,

  // Sending a message with nothing written
  SEND_NOTHING_WRITTEN: (name: string) =>
    `${name} has nothing written yet, so nothing was sent. Open Messaging and write it first.`,

  // Sending on a channel that is off
  SEND_CHANNEL_OFF: (channel: string, name: string) =>
    `${channel} is switched off for ${name}.`,

  // Sending an optional message without consent
  SEND_NO_CONSENT: (name: string) =>
    `Not sent. ${name} has not agreed to hear from us, and this one is optional.`,

  // A send held back
  SEND_HELD_BACK: (word: string) =>
    `Held back, not sent. {{${word}}} could not be filled in on this record. It is in the Send Log marked Held.`,

  // A test that cannot be filled in
  TEST_CANNOT_FILL: (word: string) =>
    `Test not sent. {{${word}}} could not be filled in. A real send in this state is held back rather than going out broken, so the test refuses too.`,

  // Duplicate rule
  DUPLICATE_RULE: (document: string, message: string) =>
    `${document} already travels with that message.`,

  // Removing a tax rule
  REMOVE_TAX_RULE: (document: string) =>
    `${document} is a tax document. The rule that sends it cannot be removed here, because whether it goes is decided by law rather than by us.`,

  // Duplicate document name
  DUPLICATE_DOCUMENT_NAME: (name: string) =>
    `There is already a document called "${name}".`,

  // Document with no name
  DOCUMENT_NO_NAME: 
    `Give the document a name.`,

  // Document added to master
  DOCUMENT_ADDED: (name: string) =>
    `${name} is now in the master. Add a rule below to decide which message carries it, or pick it under Also attach on a message.`,

  // NEW ALERTS (from addendum 2.5)
  WORD_NO_NAME:
    'The format wanted is plain words without braces.',

  WORD_ALREADY_EXISTS: (word: string, group: string) =>
    `${word} is already in ${group}, and it can be used now.`,

  WORD_ALREADY_ASKED: (word: string) =>
    `${word} is already on the list.`,

  WORD_NO_DESCRIPTION: (word: string) =>
    `The build team could not know which field is meant.`,

  WORD_NO_REASON: (word: string) =>
    `The reason is what decides whether it is worth building.`,

  WORD_REQUEST_RECORDED: (word: string) =>
    `${word} cannot be used until the field exists on the record.`,

};