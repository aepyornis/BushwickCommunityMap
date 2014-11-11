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
--- For Calculating FAR difference from total residential to built
UPDATE bushwick_pluto14v1 SET far_diff = residfar - builtfar WHERE allzoning1 ilike '%R%' 

-- set negative values to 0
UPDATE bushwick_pluto14v1 set far_diff = 0 where far_diff < 0

-- set null values to zero
UPDATE bushwick_pluto14v1 set far_diff = 0 where far_diff IS null

-- check values
SELECT allzoning1, far_diff FROM bushwick_pluto14v1 WHERE allzoning1 ilike '%r%' ORDER BY far_diff

SELECT allzoning1, far_diff, builtfar, residfar, commfar, cartodb_id 
    FROM bushwick_pluto14v1 WHERE far_diff > 0 ORDER BY far_diff DESC