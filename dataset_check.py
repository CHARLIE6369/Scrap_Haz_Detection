import os

train_labels_path = r"train/labels"

# Dataset class mapping (from data.yaml):
#   0 -> cylinder
#   1 -> shock absorber

class_names = {
    0: "cylinder",
    1: "shock absorber",
}

class_count = {
    "cylinder": 0,
    "shock absorber": 0,
}

for file in os.listdir(train_labels_path):
    if not file.endswith(".txt"):
        continue

    file_path = os.path.join(train_labels_path, file)

    with open(file_path, 'r') as f:
        lines = f.readlines()
        for line in lines:
            line = line.strip()
            if not line:
                continue

            class_id = int(line.split()[0])
            name = class_names.get(class_id)
            if name:
                class_count[name] += 1

print("Cylinder Count       :", class_count["cylinder"])
print("Shock Absorber Count :", class_count["shock absorber"])