import requests
import json
from pprint import pprint
from bs4 import BeautifulSoup

url = 'http://www.dci.ugto.mx/estudiantes/index.php/mcursos/horarios-licenciatura'

print('Sending request... ', end='')
request = requests.get(url)
document = request.content
print('OK!')

print('Scraping webpage... ', end='')
_soup = BeautifulSoup(document)
_table = _soup.find('table')
_rows = _table.find_all('tr')

def format_time(time):
    if len(time) == 1:
        return f'0{time}:00'
    elif len(time) == 2:
        return f'{time}:00'
    elif len(time) == 4:
        return f'0{time}'

day2number = {
    'LUNES': 1,
    'MARTES': 2,
    'MIÉRCOLES': 3,
    'JUEVES': 4,
    'VIERNES': 5,
    'SÁBADO': 6
}

courses = []

for _row in _rows[1:-1]:
    _cells = _row.find_all('td')

    course = {}
    course['id'] = _cells[0].text.strip()

    # Excepciones
    exception_ids = ()
    if course['id'] in exception_ids: continue

    course['name'] = _cells[1].text.strip()
    course['group'] = _cells[2].text.strip()
    course['teacher'] = _cells[7].text.strip()
    course['sessions'] = []

    for i in range(3, 7):
        _text = _cells[i].get_text(strip=True).strip()
        if _text != '':

            # Excepciones
            if course['id'] == '11' and i == 3: _text = 'MARTES/15-17/F8'
            elif course['id'] == '20' and i == 4: _text = 'VIERNES/15-17/F7'
            elif course['id'] == '29' and i == 6: _text = 'VIERNES/8-11/LAB. DE BIOLOGÍA EDIF. G'
            elif course['id'] == '45' and i == 3: _text = 'MARTES/15-17/F2'
            elif course['id'] == '106' and i == 3: _text = 'LUNES/14-16/AUDITORIO DEL EDIF. G'
            elif course['id'] == '106' and i == 4: _text = 'MIÉRCOLES/14-16/F7	'
            elif course['id'] == '144' and i == 4: _text = 'MIÉRCOLES/12-14/C2'
            elif course['id'] == '173' and i == 3: _text = 'JUEVES/15-18/AUDITORIO DE EDIF. G'

            day = day2number[_text.split('/')[0].strip()]
            begin = format_time(_text.split('/')[1].split('-')[0].strip())
            end = format_time(_text.split('/')[1].split('-')[1].strip())
            place = _text.split('/')[2].strip()

            session = {
                'day': day,
                'begin': begin,
                'end': end,
                'place': place
            }

            course['sessions'].append(session)


    courses.append(course)

options = [ course['name'] for course in courses ]
options = list(set(options))

print('OK!')

with open('data.json', 'w') as file:
    data = {
        'courses': courses,
        'options': options,
    }
    json.dump(data, file)

pprint(courses)
