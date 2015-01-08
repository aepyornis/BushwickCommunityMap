--- DOB Permits layer ---
-- add a column to translate jobtype codes to human readable
-- change table name if needed
ALTER TABLE bushwick_jobs_2014_nb ADD COLUMN jt_description TEXT

UPDATE bushwick_jobs_2014_nb SET jt_description = 
    CASE WHEN jobtype = 'A1' THEN 'Major Alteration'
             WHEN jobtype = 'A2' THEN 'Minor Alteration' 
             WHEN jobtype = 'A3' THEN 'Minor Alteration'
             WHEN jobtype = 'NB' THEN 'New Building'
            END
