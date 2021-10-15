import datetime as dt
import json


actual_time = dt.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
now = dict(now=actual_time)

print(f"nowwww {now}")

with open ('data/ora.json', 'w') as f:
    json.dump(now, f, indent=2)