# Context: HOK Admin Panel Backend & Database Integration

## Project Details
- **Project Root**: `d:/HOKAdmin/hok_admin`
- **Database Connection**: `postgresql://postgres:Rrkf4swYDLiBAhgX@db.rnvmjpxhlowhguihesja.supabase.co:5432/postgres`
- **Parent Conversation ID**: `b82baf33-b5f1-44c6-9a4b-60c39a16fde3` (Sentinel)
- **Current Orchestrator ID**: `71f625e1-3904-4901-94d2-8a2f8a242836`

## Entities Required (8 total)
1. `admins`
2. `customers`
3. `designers`
4. `listers`
5. `offers`
6. `orders`
7. `payouts`
8. `products`

## Core Operations Subsections
- Orders (`orders`)
- Offers (`offers` status filter)
- Enquiries (`offers` enquiry status filter)
- Rental Calendar (`calendar`)
- Dispatch Schedule (`dispatch`)
- Returns & Deposits (`returns`)
- Payouts to Listers (`payouts`)
- Customers (`customers`)

## Core Catalogue Subsections
- Products (`products`)
- Designers (`designers`)
- Listers (`listers`)
- LYP Submissions (`lyp`)

## Critical Rules
- Keep UI appearance completely identical.
- Replace all mock arrays with genuine database queries through the adapter.
- Strictly adhere to zero-cheating / forensic integrity audit policies.
