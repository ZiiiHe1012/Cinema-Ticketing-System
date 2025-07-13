from pathlib import Path

# 请将此处路径替换为你的本地文件绝对路径
file_path = Path(r"D:\folder\清华大学\课程资料\大二\大二夏季学期\Web前端技术实训\可选大作业1\Cinema-Ticketing-System\src\scripts\ticketPurchase.js")

# 1. 读取原文件内容
text = file_path.read_text(encoding="utf-8")
lines = text.splitlines(keepends=True)

# 2. 逐行处理：如果以恰好两个空格开头就替换为四个空格
processed_lines = []
for line in lines:
    if line.startswith("  ") and not line.startswith("    "):
        processed_lines.append("    " + line[2:])
    else:
        processed_lines.append(line)

# 3. 将修改后的内容写回原文件
file_path.write_text("".join(processed_lines), encoding="utf-8")

print("Indentation normalization complete.")
