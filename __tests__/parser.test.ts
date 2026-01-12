/**
 * Natural Language Expense Parser - Unit Tests
 */

import { parseExpenseText } from '../lib/nl/parser'
import { parseDate } from '../lib/nl/date'

describe('parseExpenseText', () => {
  // Helper to get today's date at midnight
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  describe('Amount Extraction', () => {
    test('rm12 - lowercase prefix, no space', () => {
      const result = parseExpenseText('rm12 lunch')
      expect(result.amount).toBe(12)
    })

    test('RM 12 - uppercase prefix with space', () => {
      const result = parseExpenseText('RM 12 dinner')
      expect(result.amount).toBe(12)
    })

    test('rm12.50 - with decimals', () => {
      const result = parseExpenseText('rm12.50 teh')
      expect(result.amount).toBe(12.5)
    })

    test('myr 25 - MYR prefix', () => {
      const result = parseExpenseText('myr 25 groceries')
      expect(result.amount).toBe(25)
    })

    test('12rm - suffix format', () => {
      const result = parseExpenseText('12rm grab')
      expect(result.amount).toBe(12)
    })

    test('RM 5.50 teh ais - common Malaysian format', () => {
      const result = parseExpenseText('RM 5.50 teh ais')
      expect(result.amount).toBe(5.5)
    })

    test('missing amount - should warn', () => {
      const result = parseExpenseText('lunch at mamak')
      expect(result.amount).toBeUndefined()
      expect(result.warnings).toContain('Amount not found')
    })
  })

  describe('Date Parsing', () => {
    test('today keyword', () => {
      const result = parseExpenseText('rm12 grab today')
      expect(result.date.toDateString()).toBe(today.toDateString())
      expect(result.warnings).not.toContain('Date assumed today')
    })

    test('yesterday keyword', () => {
      const result = parseExpenseText('yesterday rm25 petrol shell')
      expect(result.date.toDateString()).toBe(yesterday.toDateString())
    })

    test('D/M format - 1/12', () => {
      const result = parseExpenseText('Paid RM120 shopee 1/12 headphones')
      expect(result.date.getDate()).toBe(1)
      expect(result.date.getMonth()).toBe(11) // December (0-indexed)
    })

    test('DD/MM format - 15/01', () => {
      const result = parseExpenseText('rm30 15/01 lunch')
      expect(result.date.getDate()).toBe(15)
      expect(result.date.getMonth()).toBe(0) // January
    })

    test('D MMM format - 12 jan', () => {
      const result = parseExpenseText('rm30 12 jan dinner at pizzahut')
      expect(result.date.getDate()).toBe(12)
      expect(result.date.getMonth()).toBe(0) // January
    })

    test('no date - defaults to today with warning', () => {
      const result = parseExpenseText('rm15 nasi lemak')
      expect(result.date.toDateString()).toBe(today.toDateString())
      expect(result.warnings).toContain('Date assumed today')
    })
  })

  describe('Merchant Extraction', () => {
    test('at X pattern', () => {
      const result = parseExpenseText('rm15 nasi lemak at ali mamak')
      expect(result.merchant?.toLowerCase()).toContain('ali')
    })

    test('@ X pattern', () => {
      const result = parseExpenseText('RM8 kopi @ Zus')
      expect(result.merchant?.toLowerCase()).toContain('zus')
    })

    test('from X pattern', () => {
      const result = parseExpenseText('rm50 from shopee')
      expect(result.merchant?.toLowerCase()).toContain('shopee')
    })

    test('known brand detection - grab', () => {
      const result = parseExpenseText('rm 12 grab today')
      expect(result.merchant?.toLowerCase()).toContain('grab')
    })

    test('known brand detection - shell', () => {
      const result = parseExpenseText('yesterday rm25 petrol shell')
      expect(result.merchant?.toLowerCase()).toContain('shell')
    })
  })

  describe('Category Suggestion', () => {
    test('grab -> transport', () => {
      const result = parseExpenseText('rm 12 grab today')
      expect(result.categoryName).toBe('transport')
    })

    test('shell petrol -> transport', () => {
      const result = parseExpenseText('rm25 petrol shell')
      expect(result.categoryName).toBe('transport')
    })

    test('shopee -> shopping', () => {
      const result = parseExpenseText('Paid RM120 shopee headphones')
      expect(result.categoryName).toBe('shopping')
    })

    test('nasi lemak -> food', () => {
      const result = parseExpenseText('rm15 nasi lemak at ali mamak')
      expect(result.categoryName).toBe('food')
    })

    test('kopi -> food', () => {
      const result = parseExpenseText('RM8 kopi at Zus')
      expect(result.categoryName).toBe('food')
    })

    test('netflix -> subscriptions', () => {
      const result = parseExpenseText('rm40 netflix')
      expect(result.categoryName).toBe('subscriptions')
    })

    test('uncertain category - should warn', () => {
      const result = parseExpenseText('rm200 sewa')
      // No clear category keyword, should warn
      if (!result.categoryName) {
        expect(result.warnings).toContain('Category not detected - please select')
      }
    })
  })

  describe('Confidence Calculation', () => {
    test('high confidence with all fields', () => {
      const result = parseExpenseText('rm12 grab today')
      expect(result.confidence).toBeGreaterThanOrEqual(0.7)
    })

    test('lower confidence without explicit date', () => {
      const result = parseExpenseText('rm12 grab')
      // Should have confidence but with date warning
      expect(result.warnings).toContain('Date assumed today')
    })

    test('low confidence without amount', () => {
      const result = parseExpenseText('lunch at mamak')
      expect(result.confidence).toBeLessThan(0.5)
    })
  })

  describe('Full Sentence Parsing', () => {
    test('Spent 15 myr on nasi lemak at ali mamak', () => {
      const result = parseExpenseText('Spent 15 myr on nasi lemak at ali mamak')
      expect(result.amount).toBe(15)
      expect(result.categoryName).toBe('food')
      expect(result.merchant?.toLowerCase()).toContain('ali')
    })

    test('rm 12 grab today', () => {
      const result = parseExpenseText('rm 12 grab today')
      expect(result.amount).toBe(12)
      expect(result.categoryName).toBe('transport')
      expect(result.date.toDateString()).toBe(today.toDateString())
    })

    test('Paid RM120 shopee 1/12 headphones', () => {
      const result = parseExpenseText('Paid RM120 shopee 1/12 headphones')
      expect(result.amount).toBe(120)
      expect(result.categoryName).toBe('shopping')
      expect(result.date.getDate()).toBe(1)
      expect(result.date.getMonth()).toBe(11)
    })

    test('Yesterday rm25 petrol shell', () => {
      const result = parseExpenseText('Yesterday rm25 petrol shell')
      expect(result.amount).toBe(25)
      expect(result.categoryName).toBe('transport')
      expect(result.date.toDateString()).toBe(yesterday.toDateString())
    })

    test('RM8 kopi at Zus', () => {
      const result = parseExpenseText('RM8 kopi at Zus')
      expect(result.amount).toBe(8)
      expect(result.categoryName).toBe('food')
    })

    test('beli rm40 tng topup', () => {
      const result = parseExpenseText('beli rm40 tng topup')
      expect(result.amount).toBe(40)
      expect(result.categoryName).toBe('transport')
    })
  })
})

describe('parseDate', () => {
  test('returns today for empty input', () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const result = parseDate('no date here')
    expect(result.explicit).toBe(false)
    expect(result.date.toDateString()).toBe(today.toDateString())
  })

  test('handles semalam (Malay for yesterday)', () => {
    const yesterday = new Date()
    yesterday.setHours(0, 0, 0, 0)
    yesterday.setDate(yesterday.getDate() - 1)
    const result = parseDate('rm10 semalam')
    expect(result.explicit).toBe(true)
    expect(result.date.toDateString()).toBe(yesterday.toDateString())
  })
})
