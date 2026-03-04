"""
RSSight SEO Microservice — pure stdlib, no pkg_resources issues
"""
import re
import math
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

STOP_WORDS = set("""
a about above after again against all am an and any are aren't as at be because
been before being below between both but by can't cannot could couldn't did didn't
do does doesn't doing don't down during each few for from further get got had
hadn't has hasn't have haven't having he he'd he'll he's her here here's hers
herself him himself his how how's i i'd i'll i'm i've if in into is isn't it
it's its itself let's me more most mustn't my myself no nor not of off on once
only or other ought our ours ourselves out over own same shan't she she'd she'll
she's should shouldn't so some such than that that's the their theirs them
themselves then there there's these they they'd they'll they're they've this
those through to too under until up very was wasn't we we'd we'll we're we've
were weren't what what's when when's where where's which while who who's whom
why why's will with won't would wouldn't you you'd you'll you're you've your
yours yourself yourselves
""".split())

SEO_TERMS = {
    "seo","growth","marketing","organic","backlink","keyword","traffic",
    "conversion","funnel","retention","viral","ctr","serp","content",
    "analytics","ai","saas","ranking","domain","authority","link","meta",
    "title","engagement","roi","kpi","acquisition","activation","referral",
}

def extract_keywords(text: str, top_n: int = 6) -> list:
    words = re.findall(r'[a-zA-Z]{3,}', text.lower())
    freq = {}
    for w in words:
        if w not in STOP_WORDS:
            freq[w] = freq.get(w, 0) + 1
    sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    return [w.title() for w, _ in sorted_words[:top_n]]

def count_syllables(word: str) -> int:
    word = word.lower()
    vowels = "aeiouy"
    count, prev_vowel = 0, False
    for ch in word:
        is_v = ch in vowels
        if is_v and not prev_vowel:
            count += 1
        prev_vowel = is_v
    if word.endswith("e") and count > 1:
        count -= 1
    return max(1, count)

def flesch_reading_ease(text: str) -> float:
    sentences = max(1, len(re.split(r'[.!?]+', text)))
    words_list = re.findall(r'[a-zA-Z]+', text)
    word_count = max(1, len(words_list))
    syllable_count = sum(count_syllables(w) for w in words_list)
    score = 206.835 - 1.015*(word_count/sentences) - 84.6*(syllable_count/word_count)
    return max(0.0, min(100.0, score))

def compute_seo_score(title: str, description: str) -> int:
    score = 45
    text = f"{title} {description}".lower()
    ease = flesch_reading_ease(description or title)
    score += min(15, int(ease / 7))
    tl = len(title)
    if 45 <= tl <= 70:   score += 12
    elif 30 <= tl < 45:  score += 6
    dl = len(description)
    if dl >= 120:   score += 10
    elif dl >= 60:  score += 5
    hits = sum(1 for k in SEO_TERMS if k in text)
    score += min(18, hits * 3)
    return min(100, max(0, score))

def estimate_read_time(text: str) -> str:
    words = len(re.findall(r'\w+', text))
    return f"{max(1, math.ceil(words / 200))} min"

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json(force=True)
    items = data.get("items", [])
    for item in items:
        title = item.get("title", "")
        desc  = item.get("description", "")
        item["seoScore"] = compute_seo_score(title, desc)
        item["keywords"] = extract_keywords(f"{title} {desc}")
        item["readTime"] = estimate_read_time(desc)
    return jsonify({"items": items})

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    print("SEO service → http://localhost:5001")
    app.run(port=5001, debug=True)