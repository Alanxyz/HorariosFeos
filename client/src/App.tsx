import { useState } from 'react';
import data from './data.json';

import { Box, Button, Center, Container, Fade, Flex, FormControl, Heading, Input, InputGroup, InputLeftElement, Spacer, Table, TableContainer, Tag, TagCloseButton, TagLabel, Tbody, Td, Th, Thead, Tr, useColorMode, VStack, Wrap } from '@chakra-ui/react';
import { MoonIcon, RepeatIcon, SearchIcon, SunIcon } from '@chakra-ui/icons';
import Week from './Week';

function App() {

  // Hooks
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [schedulers, setSchedulers] = useState<any[]>([]);
  const [god, setGod] = useState(false);

  // Helpers
  const { colorMode, toggleColorMode } = useColorMode();

  const time2num = (time: string): number => parseInt(time.replace(':', ''))

  const sessionsDisjoin = (x: any, y: any): boolean => {
    if (x.day !== y.day) return true;
    
    const x_begin: number = time2num(x.begin);
    const x_end: number = time2num(x.end);
    const y_begin: number = time2num(y.begin);
    const y_end: number = time2num(y.end);
    
    const begin = Math.min(x_begin, y_begin);
    const end = Math.max(x_end, y_end);

    return end - begin >= x_end - x_begin + y_end - y_begin;
  }

  const coursesDisjoin = (x: any, y: any): boolean => {
    let disjoin = true;

    x.sessions.map((xSession: any) => {
      y.sessions.map((ySession: any) => {
          if (!sessionsDisjoin(xSession, ySession)) disjoin = false;
          return null;
        })
        return null;
      });

    return disjoin;
  }

  const isAValidScheduler = (scheduler: any): boolean => {
    let isValid = true;
    scheduler.map((i: any) => {
      scheduler.map((j: any) => {
          if (i.id !== j.id) if (!coursesDisjoin(i, j)) isValid = false;
          return null;
        });
        return null;
      });

    return isValid;
  }

  const cartesian = (...a: any[]) => a.reduce((a, b) => a.flatMap((d: any) => b.map((e: any) => [d, e].flat())));

  const generateSchedulers = (): any => {
    const classes = selectedCourses.map(className => data.courses.filter(course => className === course.name));

    let validSchedulers;
    if (selectedCourses.length === 0) validSchedulers = [];
    else if (selectedCourses.length === 1) validSchedulers = classes[0].map(x => [x]);
    else {
      const schedulers = cartesian(...classes);
      validSchedulers = schedulers.filter((scheduler: any) => isAValidScheduler(scheduler));
    } 
    
    setSchedulers(validSchedulers);
    setGod(validSchedulers.length === 0);
  }

  // Render
  return (
    <Box mx='4' className="App">
      <Flex
        h={16}
        p='3'
      >
        <Center>Increible</Center>
        <Spacer />
        <Box>
          <Button onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Box>
      </Flex>

      <Container>
        <Center>
          <Heading as='h1' size='3xl' my='10'>Horarios feos :u</Heading>
        </Center>

        <Center>
          <Wrap>
            {
              selectedCourses.map(course => (
                <Tag>
                  <TagLabel>{ course }</TagLabel>
                  <TagCloseButton
                  onClick={() => {
                    setSelectedCourses(selectedCourses.filter(x => x !== course));
                    setSchedulers([]);
                  }}
                  />
                </Tag>
              ))
            }
          </Wrap>
        </Center>


        <FormControl my='8'>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<SearchIcon color='gray.300' />}
            />
            <Input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder='Busca tus asignaturas'
            />
          </InputGroup>
        </FormControl>

        <VStack>
          {
            searchInput !== '' && data
              .options
              .filter(course => course
                .toLowerCase()
                .normalize('NFD').replace(/\p{Diacritic}/gu, '')
                .includes(searchInput.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')))
            .filter(course => !selectedCourses.includes(course))
              .map(course => (
                <Button
                  onClick={() => {
                    setSelectedCourses([...selectedCourses, course]);
                    setSearchInput('');
                    setSchedulers([]);
                  }}
                  width='100%'
                  size='sm'
                >{ course }</Button>
              ))
          }
        </VStack>

      </Container>

      <Center>
        <Button
          onClick={() => generateSchedulers()}
          leftIcon={<RepeatIcon />}
          size='lg'
          m='10'
        >
          Generar
        </Button>
      </Center>

      <Fade in={selectedCourses.length !== 0 && schedulers.length > 0}>
        {
          schedulers.map((scheduler: any, i: number) => (
              <VStack>
                <Heading size='lg' my='10'>Opción {i + 1}</Heading>
                <TableContainer my='10' fontSize='sm'>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Nombre</Th>
                        <Th>Grupo</Th>
                        <Th>Profesor</Th>
                      </Tr>
                    </Thead>
                  <Tbody>
                  {
                    scheduler.map((course: any) => (
                      <Tr>
                        <Td>{course.id}</Td>
                        <Td>{course.name}</Td>
                        <Td>{course.group}</Td>
                        <Td>{course.teacher}</Td>
                      </Tr>
                    ))
                  }
                  </Tbody>
                  </Table>
                </TableContainer>
                <Week scheduler={scheduler} />
              </VStack>
          ))
        }
      </Fade>

      <Fade in={god}>
        <Center>
          <Heading size='lg' my='10'>Llamen a Dios :0</Heading>
        </Center>
      </Fade>

    </Box>
  );
}


export default App;
