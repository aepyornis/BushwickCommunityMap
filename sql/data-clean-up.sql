--- For creating zoning style codes that will be used with CartoCSS to style the tax lots' polygon fills
-- find out the total number of rows: 11283
SELECT count(*) FROM exp_132bushwick 

-- find out the individual zoning codes (14 codes total)
SELECT distinct(allzoning1) FROM exp_132bushwick

-- find the zoning codes that are residential and commerical (3 codes)
SELECT distinct(allzoning1) FROM exp_132bushwick where allzoning1 ilike 'C%R%' order by allzoning1

-- number of rows from above: 1433
SELECT count(*) FROM exp_132bushwick where allzoning1 ilike 'C%R%'

-- find the zoning codes that are residential only (4 codes)
SELECT distinct(allzoning1) FROM exp_132bushwick where allzoning1 ilike 'R%' order by allzoning1

-- find the zoning codes that are manufacturing only (2 codes)
SELECT distinct(allzoning1) FROM exp_132bushwick where allzoning1 ilike 'M%' order by allzoning1

-- find the zoning codes that are commercial only (4 codes)
SELECT distinct(allzoning1) FROM exp_132bushwick where allzoning1 ilike 'C%' and allzoning1 not ilike '%R%' order by allzoning1

-- find the zoning codes that are parkland (1 code)
SELECT distinct(allzoning1) FROM exp_132bushwick where allzoning1 ilike 'P%' order by allzoning1

-- ignore the rows that have null zoning codes (3 rows)
SELECT count(*) FROM exp_132bushwick where allzoning1 IS NULL

--- Code to update the column "zoning_style" which will be used to style the tax lot polygon fill based on their zoning
--- Select all the code below, copy and paste into the SQL panel and run

-- set zoning_style to 'R' for residential 
UPDATE exp_132bushwick SET zoning_style = 'R' WHERE allzoning1 ilike 'R%' ;

-- set zoning_style to 'C' for commericial
UPDATE exp_132bushwick SET zoning_style = 'C' WHERE allzoning1 ilike 'C%' and allzoning1 not ilike '%R%';

-- set zoning_style to 'RC' for residential & commericial
UPDATE exp_132bushwick SET zoning_style = 'RC' WHERE allzoning1 ilike 'C%R%';

-- set zoning_style to 'M' for manufacturing
UPDATE exp_132bushwick SET zoning_style = 'M' WHERE allzoning1 ilike 'M%';

-- set zoning_style to 'P' for parkland
UPDATE exp_132bushwick SET zoning_style = 'P' WHERE allzoning1 ilike 'P%';

-- set zoning_style to 'null' for NULL 
UPDATE exp_132bushwick SET zoning_style = 'null' WHERE allzoning1 = '';