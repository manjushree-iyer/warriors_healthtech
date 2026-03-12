import pandas as pd
from sklearn.ensemble import RandomForestClassifier

data = {
    "age":[25,45,52,23,40],
    "cholesterol":[180,250,240,170,220],
    "bp":[120,150,140,115,135],
    "risk":[0,1,1,0,1]
}

df = pd.DataFrame(data)

X = df[["age","cholesterol","bp"]]
y = df["risk"]

model = RandomForestClassifier()
model.fit(X,y)

new_data = pd.DataFrame({
    "age":[50],
    "cholesterol":[230],
    "bp":[145]
})

prediction = model.predict(new_data)

print(prediction)