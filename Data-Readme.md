# National QFI Grant Data Consolidation

## What We Did

We had 13 separate CSV files containing grant data from different locations across the United States, each with slightly different column structures. Some files had more columns, some had fewer, and many had similar information stored under different column names.

**The Challenge:** Each CSV used different naming conventions and had varying levels of detail, making it difficult to analyze the data as a whole.

**The Solution:** We combined all files into one master dataset while preserving the source of each record.

## The Process

1. **Analyzed** all 13 CSV files to understand their structure
2. **Identified** 51 unique columns across all files  
3. **Standardized** the data by creating a unified column structure
4. **Added** a `Source_File` column to track where each record came from
5. **Combined** everything into `Combined_National_QFI_Data.csv`
6. **Cleaned up** duplicate/similar columns with slightly different names

### Column Analysis Details

**Universal Columns** (appeared in all/most files):
- `School` - in all 13 files
- `QFI contact` - in 12 files  
- `Title of Project` - in 12 files
- `Grant ID` - in 11 files
- `Date range of grant` - in 11 files
- `Grants Payments to be made Payable to` - in 11 files
- `Other budget items` - in 11 files

**Common Columns** (appeared in multiple files):
- `Amount` / `Total Amount` - in 10+ files (combined these)
- `Date of letter` / `Date of Letter` - in 10+ files (combined these) 
- `Purpose of Grant` / `Purpose of Grants` / `Purpose of grant` / `Purpose` - in 11+ files (combined these)
- `Personnal costs` / `Personnel funds` / `Teacher Salary` - in 10+ files (combined these)

**Location-Specific Contact Columns** (unique to each location):
- `Boston Public School contact`, `CPS contact`, `Houston Schools contact`
- `School District contact`, `Schools contact`, `TUSD contact`
- `Public School contact` - each appeared in 1-5 files

**Unique Columns** (appeared in only 1-2 files):
- `Grant number`, `Grant extended`, `What else funded` (NYC only)
- `Grant Proposal`, `Target`, `Date of application` (New Haven only)
- `Year`, `Teacher`, `Grantor` (Anaheim only)
- `Sheet` (DCPS only)

## What's in the Final Dataset

- **70 total records** from 13 different locations
- **44 standardized columns** covering all grant information
- **Source tracking** so you know which city/region each grant came from

### Locations Included:
- Minneapolis (11 grants)
- Houston (10 grants)
- NYC (9 grants)
- New Haven (8 grants)
- Austin, Cumberland County NC (6 grants each)
- Chicago (5 grants)
- Georgia, Boston (4 grants each)
- Anaheim, DCPS, Tucson (2 grants each)
- Montana (1 grant)

## Key Benefits

✅ **All data in one place** - no more switching between files  
✅ **Consistent structure** - same columns across all records  
✅ **Source preserved** - easy to filter by location  
✅ **Analysis ready** - perfect for creating reports, charts, or dashboards

## Files Created

- `Combined_National_QFI_Data.csv` - The master dataset
- `analyze_csvs.py` - Script used to analyze column structures
- `combine_csvs.py` - Script that did the actual combination

Now you can easily analyze grant patterns, amounts, purposes, and trends across all QFI locations in one comprehensive dataset!