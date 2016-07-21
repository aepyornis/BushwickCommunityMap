-- Delete column names to save space in CartoDB
ALTER TABLE bushwick_pluto_16v1 DROP COLUMN ltdheight;
ALTER TABLE bushwick_pluto_16v1 DROP COLUMN spdist1;
ALTER TABLE bushwick_pluto_16v1 DROP COLUMN spdist2;

--- SQL For creating zoning style codes that will be used with CartoCSS to style the tax lots' polygon fills
--- Using Postgres with PostGIS
--------------------------------------------------------------------------------------------------------------
-- find out the total number of rows: 11223
-- SELECT count(*) FROM bushwick_pluto_16v1 

-- find out the individual zoning codes (20 codes total)
-- SELECT distinct(allzoning1) FROM bushwick_pluto_16v1

-- find the zoning codes that are residential and commercial (5 codes)
-- SELECT distinct(allzoning1) FROM bushwick_pluto_16v1 where allzoning1 ilike 'C%R%' order by allzoning1

-- number of rows: 1469
-- SELECT count(*) FROM bushwick_pluto_16v1 where allzoning1 ilike 'C%R%'

-- find the zoning codes that are residential only (6 codes)
-- SELECT distinct(allzoning1) FROM bushwick_pluto_16v1 where allzoning1 ilike 'R%' order by allzoning1

-- find the zoning codes that are manufacturing only (3 codes)
-- SELECT distinct(allzoning1) FROM bushwick_pluto_16v1 where allzoning1 ilike 'M%' order by allzoning1

-- find the zoning codes that are commercial only (4 codes)
-- SELECT distinct(allzoning1) FROM bushwick_pluto_16v1 where allzoning1 ilike 'C%' and allzoning1 not ilike '%R%' order by allzoning1

-- find the zoning codes that are parkland (1 code)
-- SELECT distinct(allzoning1) FROM bushwick_pluto_16v1 where allzoning1 ilike 'P%' order by allzoning1

-- ignore the rows that have null zoning codes (3 rows)
-- SELECT count(*) FROM bushwick_pluto_16v1 where allzoning1 IS NULL

--------------------------------------------------------------------------------------------------------------
--- Code to update the column "zoning_style" which will be used to style the tax lot polygon fill based on their zoning
--- Select all the code below, copy and paste into the SQL panel and run

-- create a column to store value for general zoning 
ALTER TABLE bushwick_pluto_16v1 ADD COLUMN zoning_style TEXT;

-- set zoning_style to 'R' for residential 
UPDATE bushwick_pluto_16v1 SET zoning_style = 'R' WHERE allzoning1 ilike 'R%' ;

-- set zoning_style to 'C' for commericial
UPDATE bushwick_pluto_16v1 SET zoning_style = 'C' WHERE allzoning1 ilike 'C%' and allzoning1 not ilike '%R%';

-- set zoning_style to 'RC' for residential & commericial
UPDATE bushwick_pluto_16v1 SET zoning_style = 'RC' WHERE allzoning1 ilike 'C%R%';

-- set zoning_style to 'M' for manufacturing
UPDATE bushwick_pluto_16v1 SET zoning_style = 'M' WHERE allzoning1 ilike 'M%';

-- set zoning_style to 'P' for parkland
UPDATE bushwick_pluto_16v1 SET zoning_style = 'P' WHERE allzoning1 ilike 'P%';

-- set zoning_style to 'null' for NULL values
UPDATE bushwick_pluto_16v1 SET zoning_style = 'null' WHERE allzoning1 = '';

-------------------------------------------------------
-- create a new column for available FAR
ALTER TABLE bushwick_pluto_16v1 ADD COLUMN availablefar REAL DEFAULT 0;

--- For Calculating FAR difference from total residential to built
UPDATE bushwick_pluto_16v1 SET availablefar = residfar - builtfar WHERE allzoning1 ilike '%R%'; 

-- set negative values to 0
UPDATE bushwick_pluto_16v1 SET availablefar = 0 WHERE availablefar < 0;

-- set null values to zero
UPDATE bushwick_pluto_16v1 SET availablefar = 0 WHERE availablefar IS NULL;

--- check values
--SELECT allzoning1, availablefar FROM bushwick_pluto_16v1 WHERE allzoning1 ilike '%r%' ORDER BY availablefar desc;

--SELECT allzoning1, availablefar, builtfar, residfar, commfar, cartodb_id 
 --   FROM bushwick_pluto_16v1 WHERE availablefar > 0 ORDER BY availablefar DESC

-------------------------------------------------------
--SELECT a.* FROM bushwick_pluto_16v1 a, vacant_596acres b WHERE ST_Intersects(a.the_geom, b.the_geom)

-- add a column for landuse descriptions
ALTER TABLE bushwick_pluto_16v1 ADD COLUMN lu_descript TEXT;

-- add values based on landuse codes
UPDATE bushwick_pluto_16v1 SET lu_descript = 
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
         END;

-- add a column for ACRIS link:
ALTER TABLE bushwick_pluto_16v1 ADD COLUMN acris_link TEXT;

-- set the column to have a hyperlink to the ACRIS URL for the tax lot:
UPDATE bushwick_pluto_16v1 SET acris_link = 
'<a href="http://a836-acris.nyc.gov/bblsearch/bblsearch.asp?borough=3&block=' 
|| block::text || '&lot=' || lot::text || '" target="_blank">Click here for ACRIS information</a>' ;
