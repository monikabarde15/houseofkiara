// Messages Service
/* ========================================
   Promotions Module - Shopper Messages Service
   Based on HOK_Promotions_Logic_Spec_v150.pdf Section 10
   ======================================== */

import { ShopperMessages } from '../types/promotions.types';
import { DEFAULT_SHOPPER_MESSAGES } from '../utils/constants';

export const messagesService = {
  async getMessages(): Promise<ShopperMessages> {
    // In production: GET to /api/promotions/messages
    await new Promise(resolve => setTimeout(resolve, 300));
    return DEFAULT_SHOPPER_MESSAGES;
  },

  async updateMessages(messages: Partial<ShopperMessages>): Promise<ShopperMessages> {
    // In production: PUT to /api/promotions/messages
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...DEFAULT_SHOPPER_MESSAGES, ...messages };
  },
};