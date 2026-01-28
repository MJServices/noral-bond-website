-- Populate bond_score for testing
UPDATE profiles
SET bond_score = 35
WHERE bond_score IS NULL OR bond_score = 0;

-- Also verify the schema has the column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'bond_score';
