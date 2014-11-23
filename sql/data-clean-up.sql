-- Delete column names to save space in CartoDB
ALTER TABLE bushwick_pluto14v1 DROP COLUMN ltdheight
ALTER TABLE bushwick_pluto14v1 DROP COLUMN spdist1
ALTER TABLE bushwick_pluto14v1 DROP COLUMN spdist2

--- SQL For creating zoning style codes that will be used with CartoCSS to style the tax lots' polygon fills
--- Using Postgres with PostGIS
--------------------------------------------------------------------------------------------------------------
-- find out the total number of rows: 11283
SELECT count(*) FROM bushwick_pluto14v1 

-- find out the individual zoning codes (14 codes total)
SELECT distinct(allzoning1) FROM bushwick_pluto14v1

-- find the zoning codes that are residential and commerical (3 codes)
SELECT distinct(allzoning1) FROM bushwick_pluto14v1 where allzoning1 ilike 'C%R%' order by allzoning1

-- number of rows from above: 1433
SELECT count(*) FROM bushwick_pluto14v1 where allzoning1 ilike 'C%R%'

-- find the zoning codes that are residential only (4 codes)
SELECT distinct(allzoning1) FROM bushwick_pluto14v1 where allzoning1 ilike 'R%' order by allzoning1

-- find the zoning codes that are manufacturing only (2 codes)
SELECT distinct(allzoning1) FROM bushwick_pluto14v1 where allzoning1 ilike 'M%' order by allzoning1

-- find the zoning codes that are commercial only (4 codes)
SELECT distinct(allzoning1) FROM bushwick_pluto14v1 where allzoning1 ilike 'C%' and allzoning1 not ilike '%R%' order by allzoning1

-- find the zoning codes that are parkland (1 code)
SELECT distinct(allzoning1) FROM bushwick_pluto14v1 where allzoning1 ilike 'P%' order by allzoning1

-- ignore the rows that have null zoning codes (3 rows)
SELECT count(*) FROM bushwick_pluto14v1 where allzoning1 IS NULL

--------------------------------------------------------------------------------------------------------------
--- Code to update the column "zoning_style" which will be used to style the tax lot polygon fill based on their zoning
--- Select all the code below, copy and paste into the SQL panel and run

-- set zoning_style to 'R' for residential 
UPDATE bushwick_pluto14v1 SET zoning_style = 'R' WHERE allzoning1 ilike 'R%' ;

-- set zoning_style to 'C' for commericial
UPDATE bushwick_pluto14v1 SET zoning_style = 'C' WHERE allzoning1 ilike 'C%' and allzoning1 not ilike '%R%';

-- set zoning_style to 'RC' for residential & commericial
UPDATE bushwick_pluto14v1 SET zoning_style = 'RC' WHERE allzoning1 ilike 'C%R%';

-- set zoning_style to 'M' for manufacturing
UPDATE bushwick_pluto14v1 SET zoning_style = 'M' WHERE allzoning1 ilike 'M%';

-- set zoning_style to 'P' for parkland
UPDATE bushwick_pluto14v1 SET zoning_style = 'P' WHERE allzoning1 ilike 'P%';

-- set zoning_style to 'null' for NULL values
UPDATE bushwick_pluto14v1 SET zoning_style = 'null' WHERE allzoning1 = '';

-------------------------------------------------------
-- create a new column for available FAR
ALTER TABLE bushwick_pluto14v1 ADD COLUMN availablefar REAL DEFAULT 0;

--- For Calculating FAR difference from total residential to built
UPDATE bushwick_pluto14v1 SET availablefar = residfar - builtfar WHERE allzoning1 ilike '%R%'; 

-- set negative values to 0
UPDATE bushwick_pluto14v1 SET availablefar = 0 WHERE availablefar < 0;

-- set null values to zero
UPDATE bushwick_pluto14v1 SET availablefar = 0 WHERE availablefar IS NULL;

--- check values
--SELECT allzoning1, availablefar FROM bushwick_pluto14v1 WHERE allzoning1 ilike '%r%' ORDER BY availablefar

--SELECT allzoning1, availablefar, builtfar, residfar, commfar, cartodb_id 
 --   FROM bushwick_pluto14v1 WHERE availablefar > 0 ORDER BY availablefar DESC

-------------------------------------------------------
--SELECT a.* FROM bushwick_pluto14v1 a, vacant_596acres b WHERE ST_Intersects(a.the_geom, b.the_geom)

-- add a column for landuse descriptions
ALTER TABLE bushwick_pluto14v1 ADD COLUMN lu_descript TEXT

-- add values based on landuse codes
UPDATE bushwick_pluto14v1 SET lu_descript = 
    CASE WHEN landuse = '01' THEN 'One and Two Family Buildings'
         WHEN landuse = '02' THEN 'Multi-Family Walkup'
         WHEN landuse = '03' THEN 'Multi-Family with Elevator'
         WHEN landuse = '04' THEN 'Mixed Residential & Commerical'
         WHEN landuse = '05' THEN 'Commerical & Office'
         WHEN landuse = '06' THEN 'Industrial & Manufacturing'
         WHEN landuse = '07' THEN 'Transport & utility'
         WHEN landuse = '08' THEN 'Public Facilities & Insitutions'
         WHEN landuse = '09' THEN 'Open Space & Recreation'
         WHEN landuse = '10' THEN 'Parking Facilities'
         WHEN landuse = '11' THEN 'Vacant Land'
         WHEN landuse IS NULL THEN 'N/A'
         END 

--- DOB Permits layer ---
-- add a column to translate jobtype codes to human readable
ALTER TABLE exp_codedjobs ADD COLUMN jt_description TEXT

UPDATE exp_codedjobs SET jt_description = 
    CASE WHEN jobtype = 'A1' THEN 'Major Alteration'
             WHEN jobtype = 'A2' THEN 'Minor Alteration' 
             WHEN jobtype = 'A3' THEN 'Minor Alteration'
             WHEN jobtype = 'NB' THEN 'New Building'
            END

-- SELECT jobtype,
--     CASE WHEN jobtype = 'A1' THEN 'Major Alteration'
--              WHEN jobtype = 'A2' THEN 'Minor Alteration' 
--              WHEN jobtype = 'A3' THEN 'Minor Alteration'
--              WHEN jobtype = 'NB' THEN 'New Building'
--             END
-- FROM exp_codedjobs

-- SELECT landuse,
--     CASE WHEN landuse = '01' THEN '1 & 2 Family Buildings'
--          WHEN landuse = '02' THEN 'Multi-Family Walkup'
--          WHEN landuse = '03' THEN 'Multi-Family with Elevator'
--          WHEN landuse = '04' THEN 'Mixed Residential & Commerical'
--          WHEN landuse = '05' THEN 'Commerical & Office'
--          WHEN landuse = '06' THEN 'Industrial & Manufacturing'
--          WHEN landuse = '07' THEN 'Transport & utility'
--          WHEN landuse = '08' THEN 'Public Facilities & Insitutions'
--          WHEN landuse = '09' THEN 'Open Space & Recreation'
--          WHEN landuse = '10' THEN 'Parking Facilities'
--          WHEN landuse = '11' THEN 'Vacant Land'
--          WHEN landuse IS NULL THEN 'N/A'
--          END
-- FROM bushwick_pluto14v1







