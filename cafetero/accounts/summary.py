import pandas as pd

file = "inventory.xlsx"   # <-- change if filename is different

print("Loading data...")

# Load sheets
sheet1 = pd.read_excel(file, sheet_name="Non Moving")
sheet2 = pd.read_excel(file, sheet_name="Data")

# Helper to convert
def to_numeric_safe(series):
    return pd.to_numeric(series, errors='coerce').fillna(0)

# Clean numeric fields
sheet1["Physical inventory"] = to_numeric_safe(sheet1["Physical inventory"])
sheet1["Total Cost"] = to_numeric_safe(sheet1["Total Cost"])

sheet2["Physical inventory"] = to_numeric_safe(sheet2["Physical inventory"])
sheet2["Total Cost"] = to_numeric_safe(sheet2["Total Cost"])

print("✔ Cleaning Completed")

# --- Summary 1: Moving vs Non Moving (from sheet2) ---

summary_status = sheet2.groupby("STATUS").agg(
    SKUs=("Item number", "count"),
    QTY=("Physical inventory", "sum"),
    Value_SAR=("Total Cost", "sum")
).reset_index()

# --- Summary 2: Month-wise (from sheet1) ---

summary_months = sheet1.groupby("Category of Non Moving").agg(
    SKUs=("Item number", "count"),
    QTY=("Physical inventory", "sum"),
    Value_SAR=("Total Cost", "sum")
).reset_index()

# Write Result
output_file = "summary_output.xlsx"

with pd.ExcelWriter(output_file, engine="openpyxl") as writer:
    sheet1.to_excel(writer, sheet_name="Non Moving", index=False)
    sheet2.to_excel(writer, sheet_name="Data", index=False)
    summary_status.to_excel(writer, sheet_name="Summary_Status", index=False)
    summary_months.to_excel(writer, sheet_name="Summary_Months", index=False)

print(f"\n🎉 Done! File generated: {output_file}")
