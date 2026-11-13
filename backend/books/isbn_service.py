import urllib.request
import urllib.parse
import json
import logging

logger = logging.getLogger(__name__)


def lookup_isbn_metadata(isbn_query):
    """
    Retrieves book metadata for a given ISBN or barcode from Open Library / Google Books.
    Cleans ISBN (removes dashes and spaces).
    Returns dict with title, author, edition, publisher, description, cover_url.
    """
    clean_isbn = isbn_query.replace('-', '').replace(' ', '').strip()
    if not clean_isbn:
        return None

    # 1. Try Open Library API
    try:
        url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{clean_isbn}&jscmd=data&format=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'BookBazar/1.0 (Student Marketplace)'})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                key = f"ISBN:{clean_isbn}"
                if key in data:
                    book_data = data[key]
                    authors = [a.get('name', '') for a in book_data.get('authors', [])]
                    publishers = [p.get('name', '') for p in book_data.get('publishers', [])]
                    cover = book_data.get('cover', {}).get('large') or book_data.get('cover', {}).get('medium')

                    return {
                        'found': True,
                        'isbn': clean_isbn,
                        'title': book_data.get('title', ''),
                        'author': ', '.join(authors) if authors else '',
                        'publisher': ', '.join(publishers) if publishers else '',
                        'publish_date': book_data.get('publish_date', ''),
                        'number_of_pages': book_data.get('number_of_pages'),
                        'cover_url': cover,
                        'source': 'OpenLibrary'
                    }
    except Exception as e:
        logger.warning(f"OpenLibrary lookup failed for ISBN {clean_isbn}: {e}")

    # 2. Fallback to Google Books API
    try:
        url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{urllib.parse.quote(clean_isbn)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'BookBazar/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                if data.get('totalItems', 0) > 0:
                    item = data['items'][0]['volumeInfo']
                    authors = item.get('authors', [])
                    image_links = item.get('imageLinks', {})
                    cover = image_links.get('thumbnail') or image_links.get('smallThumbnail')
                    if cover and cover.startswith('http://'):
                        cover = cover.replace('http://', 'https://')

                    return {
                        'found': True,
                        'isbn': clean_isbn,
                        'title': item.get('title', ''),
                        'author': ', '.join(authors) if authors else '',
                        'publisher': item.get('publisher', ''),
                        'publish_date': item.get('publishedDate', ''),
                        'description': item.get('description', ''),
                        'cover_url': cover,
                        'source': 'GoogleBooks'
                    }
    except Exception as e:
        logger.warning(f"Google Books lookup failed for ISBN {clean_isbn}: {e}")

    return {
        'found': False,
        'isbn': clean_isbn,
        'message': f"No metadata found for ISBN {clean_isbn}. You can enter details manually."
    }
