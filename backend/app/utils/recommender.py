import os
import pickle

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

books_path = os.path.join(BASE_DIR, "ml_models", "books.pkl")
similarity_path = os.path.join(BASE_DIR, "ml_models", "similarity.pkl")

books = pickle.load(open(books_path, "rb"))
similarity = pickle.load(open(similarity_path, "rb"))

def test_load():
    return "Model loaded successfully"

def hybrid_recommend(book_name=None, mood=None):
    recommendations = set()

    # 1. Content-based
    if book_name:
        book_name = book_name.lower()
        matches = books[books["title"].str.lower().str.contains(book_name)]

        if not matches.empty:
            index = matches.index[0]
            distances = list(enumerate(similarity[index]))
            books_list = sorted(distances, key=lambda x: x[1], reverse=True)[1:10]

            for i in books_list:
                recommendations.add(books.iloc[i[0]].title)

    # 2. Mood-based
    if mood:
        mood = mood.lower()

        if mood == "happy":
            mood_books = books[books["genres"].str.contains("romance|comedy|fun", case=False, na=False)]
        elif mood == "sad":
            mood_books = books[books["genres"].str.contains("drama|tragedy", case=False, na=False)]
        elif mood == "adventure":
            mood_books = books[books["genres"].str.contains("adventure|fantasy", case=False, na=False)]
        elif mood == "thriller":
            mood_books = books[books["genres"].str.contains("thriller|mystery", case=False, na=False)]
        else:
            mood_books = books

        for title in mood_books["title"].head(10):
            recommendations.add(title)

    # 3. Popularity-based
    if "popularity_score" in books.columns:
        popular = books.sort_values(by="popularity_score", ascending=False)
        for title in popular["title"].head(10):
            recommendations.add(title)

    return list(recommendations)[:10]