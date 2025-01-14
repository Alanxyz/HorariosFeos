import requests
import json
from pprint import pprint
from bs4 import BeautifulSoup

##La pagina de la DCI ahora cambio los datos a 2 paginas (A-F) y (G-Z), solo se modifico el codigo original
## agregando 2 url y combinando las lecturas de materias de ambas paginas

#url = 'https://www.dci.ugto.mx/estudiantes/index.php/mcursos/horarios-licenciatura/2-uncategorised/594-udaslestrasa-f'

urls = [
    'https://www.dci.ugto.mx/estudiantes/index.php/mcursos/horarios-licenciatura/2-uncategorised/594-udaslestrasa-f',
    'https://www.dci.ugto.mx/estudiantes/index.php/mcursos/horarios-licenciatura/2-uncategorised/595-udaslestrasg-z'
]

def fetch_courses_from_url(url): #Ps nomas meto todo en una funcion y la llamo 2 veces xdd
    print(f'Sending request to {url}... ', end='')
    request = requests.get(url, verify=False)
    document = request.content
    print('OK!')

    print('Scraping webpage... ', end='')
    _soup = BeautifulSoup(document, 'html.parser')
    _table = _soup.find('table')
    _rows = _table.find_all('tr')

    def format_time(time):
        if len(time) == 1:
            return f'0{time}:00'
        elif len(time) == 2:
            return f'{time}:00'
        elif len(time) == 4:
            return f'0{int(time[0:-3]) + 1}:00'
        elif len(time) == 5:
            return f'{int(time[0:-3]) + 1}:00'

    day2number = {
        'LUNES': 1,
        'MARTES': 2,
        'MIÉRCOLES': 3,
        'MIÉRCOLES' :3,
        'MIERCOLES': 3,
        'JUEVES': 4,
        'JUVES': 4,
        'VIERNES': 5,
        'SÁBADO': 6,
        'SABADO': 6
    }

    courses = []

    for _row in _rows[1:]:
        _cells = _row.find_all('td')

        course = {}
        course['id'] = _cells[0].text.strip()

        # Excepciones
        exception_ids = []
        if course['id'] in exception_ids: continue

        course['name'] = _cells[1].text.strip()
        course['group'] = _cells[2].text.strip()
        course['teacher'] = _cells[7].text.strip()
        course['sessions'] = []

        for i in range(3, 7):
            _text = _cells[i].get_text(strip=True).strip()
            if _text != '':
                # Excepciones

                #Podria haber problemas si hay ids repetidos en ambas paginas, en este caso, como la primera
                #solo llegaba a 90 pues no hubo pedos, corregir en caso de que haya casos como un error en
                #id = 70 en 2 paginas de 90. Sugerencia: agregar un and de la forma url == urls[0] o algo asi
                if course['id'] == '132' and i == 4: _text = 'MIÉRCOLES/12-14/C2'
                elif course['id'] == '131' and i == 5: _text = 'MARTES/10-12/LAB. DE FÍSICA CLÁSICA, EDIF. C'
                elif course['id'] == '133' and i == 4: _text = 'JUEVES/12-14/F5'
                elif course['id'] == '148' and i == 4: _text = 'MIÉRCOLES/12-14/SALA DE JUNTAS DEL EDIF. B'
                #print('Bien en ',course['id'],_text) # Buena linea para verificar si hay errores en excepciones
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

    return courses #La funcion retorna courses, que basicamente son los cursos de cada pagina

all_courses = []  #se crea un array que guarde todos los courses de las 2 paginas
for url in urls:  #se llama la funcion 2 veces (o mas si en un futuro agregan mas paginas)
    all_courses.extend(fetch_courses_from_url(url))

options = list(set(course['name'] for course in all_courses))

print('Saving to JSON file... ', end='')

with open('data.json', 'w') as file:
    data = {
        'courses': all_courses,
        'options': options,
    }
    json.dump(data, file)

# pprint(courses)
