// utils/templates.ts

export const templates = {
  // WhatsApp message templates
  whatsapp: {
    welcome: (name: string): string => {
      return `Welcome to House of Kaira, ${name}! We're delighted to have you.`;
    },
    orderConfirmation: (name: string, orderId: string): string => {
      return `Hi ${name}, your order ${orderId} has been confirmed. We'll keep you updated on the status.`;
    },
    returnInitiated: (name: string, returnId: string): string => {
      return `Hi ${name}, your return ${returnId} has been initiated. We'll process it shortly.`;
    },
    depositReminder: (name: string, dueDate: string): string => {
      return `Hi ${name}, a gentle reminder that your deposit is due on ${dueDate}. Please complete it to confirm your booking.`;
    },
    paymentReceived: (name: string, amount: string): string => {
      return `Hi ${name}, we've received your payment of ${amount}. Thank you!`;
    },
  },

  // Email templates
  email: {
    welcome: (name: string): string => {
      return `Dear ${name},

Welcome to House of Kaira!

We are delighted to have you with us. You can now explore our curated collection of designer pieces, save your favourites, and book rentals.

If you have any questions, please don't hesitate to reach out.

With love,
The House of Kaira Team`;
    },
    orderConfirmation: (name: string, orderId: string): string => {
      return `Dear ${name},

Thank you for your order ${orderId}. We are processing it and will update you shortly.

With love,
The House of Kaira Team`;
    },
    returnConfirmation: (name: string, returnId: string): string => {
      return `Dear ${name},

Your return request ${returnId} has been received. We will process it within 3-5 business days.

With love,
The House of Kaira Team`;
    },
  },

  // History templates
  history: {
    messageCreated: (messageName: string): string => {
      return `Message "${messageName}" was created`;
    },
    messageUpdated: (messageName: string): string => {
      return `Message "${messageName}" was updated`;
    },
    messageSent: (messageName: string, recipient: string): string => {
      return `Message "${messageName}" was sent to ${recipient}`;
    },
    wordingAdded: (messageName: string, wordingName: string): string => {
      return `Wording "${wordingName}" was added to "${messageName}"`;
    },
    wordingRemoved: (messageName: string, wordingName: string): string => {
      return `Wording "${wordingName}" was removed from "${messageName}"`;
    },
    wordingUpdated: (messageName: string, wordingName: string): string => {
      return `Wording "${wordingName}" was updated in "${messageName}"`;
    },
    channelToggled: (messageName: string, channel: string, state: string): string => {
      return `Channel "${channel}" was ${state} for "${messageName}"`;
    },
    statusChanged: (messageName: string, from: string, to: string): string => {
      return `Status changed from "${from}" to "${to}" for "${messageName}"`;
    },
  },

  // Communication templates
  communication: {
    requestMoreInfo: (messageName: string, presets: string[]): string => {
      const presetList = presets.map(p => `"${p}"`).join(', ');
      return `Requested more info on "${messageName}" using presets: ${presetList}`;
    },
    rejectMessage: (messageName: string, reasons: string[]): string => {
      const reasonList = reasons.map(r => `"${r}"`).join(', ');
      return `Rejected "${messageName}" with reasons: ${reasonList}`;
    },
    approveMessage: (messageName: string): string => {
      return `Approved "${messageName}"`;
    },
    withdrawMessage: (messageName: string): string => {
      return `Withdrew "${messageName}"`;
    },
    expireMessage: (messageName: string): string => {
      return `Expired "${messageName}"`;
    },
  },

  // Activity templates
  activity: {
    userLoggedIn: (user: string): string => {
      return `${user} logged in`;
    },
    userLoggedOut: (user: string): string => {
      return `${user} logged out`;
    },
    userViewed: (user: string, target: string): string => {
      return `${user} viewed "${target}"`;
    },
    userEdited: (user: string, target: string): string => {
      return `${user} edited "${target}"`;
    },
    userCreated: (user: string, target: string): string => {
      return `${user} created "${target}"`;
    },
    userDeleted: (user: string, target: string): string => {
      return `${user} deleted "${target}"`;
    },
  },
};