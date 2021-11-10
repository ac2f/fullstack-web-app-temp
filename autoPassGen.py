import string, random, json;
with open("pre_.json", "w+") as f:
    f.write(json.dumps({f"headers{i}":(lambda x:("".join(random.choice(string.printable) for i in range(x))))(96).replace("\"", "\\\"") for i in range(20, 60)}, indent=4));