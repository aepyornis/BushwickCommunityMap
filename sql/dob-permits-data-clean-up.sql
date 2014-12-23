--- DOB Permits layer ---
-- add a column to translate jobtype codes to human readable
ALTER TABLE exp_codedjobs ADD COLUMN jt_description TEXT

UPDATE exp_codedjobs SET jt_description = 
    CASE WHEN jobtype = 'A1' THEN 'Major Alteration'
             WHEN jobtype = 'A2' THEN 'Minor Alteration' 
             WHEN jobtype = 'A3' THEN 'Minor Alteration'
             WHEN jobtype = 'NB' THEN 'New Building'
            END
