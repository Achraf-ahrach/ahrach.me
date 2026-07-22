-- Migration: Add 'admin' value to user_role enum
-- Date: 2026-07-22

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';
