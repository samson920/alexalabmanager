import csv

results = []
#reads items in a CSV
with open("520.csv") as csvfile: #replace with CSV file name
    reader = csv.reader(csvfile) 
    for row in reader:
        results.append(row)
#outputs a JSON with all items in the CSV to add to a slot
with open("output.txt", "w") as f:
	for i in range(1, len(results)):
		f.write("{\n")
		f.write('\t"id": null,\n')
		f.write('\t"name": {\n')
		f.write('\t\t"value": "' + str(results[i])[2:][:-2] + '",\n')
		f.write('\t\t"synonyms": []\n')
		f.write('\t}\n')
		f.write('},\n')