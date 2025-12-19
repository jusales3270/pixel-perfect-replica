-- Create storage bucket for card attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('card-attachments', 'card-attachments', true)
ON CONFLICT (id) DO NOTHING;