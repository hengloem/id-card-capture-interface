/*
  # ID Card Capture System

  1. New Tables
    - `id_card_captures`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `front_image_url` (text) - URL to front of ID card
      - `back_image_url` (text) - URL to back of ID card
      - `owner_image_url` (text) - URL to photo of ID card owner
      - `metadata` (jsonb) - Additional metadata about the capture

  2. Security
    - Enable RLS on `id_card_captures` table
    - Add policy for anyone to insert captures (public submission)
    - Add policy for anyone to view captures (for demo purposes)

  3. Storage
    - Create storage bucket for ID card images
    - Enable public access for the bucket
*/

-- Create the id_card_captures table
CREATE TABLE IF NOT EXISTS id_card_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  front_image_url text,
  back_image_url text,
  owner_image_url text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE id_card_captures ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert captures (public submission system)
CREATE POLICY "Anyone can submit ID card captures"
  ON id_card_captures
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to view captures (for demo purposes)
CREATE POLICY "Anyone can view ID card captures"
  ON id_card_captures
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create storage bucket for ID card images
INSERT INTO storage.buckets (id, name, public)
VALUES ('id-cards', 'id-cards', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload to the bucket
CREATE POLICY "Anyone can upload ID card images"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'id-cards');

-- Allow anyone to view images
CREATE POLICY "Anyone can view ID card images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'id-cards');