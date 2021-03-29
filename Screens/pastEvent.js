import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView } from 'react-native';

const PastEvent = (props) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const eventList = events.map((event) => <li key={event.name}>{event.name}</li>);

  const fetchEvents = async () => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');

    if (!storedToken) {
      setLoading(false);
      setError('To get started login at the user page.');
      return;
    }
    setToken(storedToken);

    try {
      let res = await fetch('https://bussin.blakekjohnson.dev/api/event/past', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      res = await res.json();

      setEvents(res.events);
    } catch (e) {
      setError(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      setLoading(true);
      setError(null);
      setEvents([]);
      fetchEvents();
    });
  }, []);

  const createPastEventTable = async () => {
    if(!events){
      return (
        <Text> No Past Events </Text>
      )
    }
    return (
    <tbody>
      {events.map((item) => {
        return (
          <tr>
            {Object.entries(item).map(field => {
              return (<td>{field[1]}</td>)
            })
            }
          </tr>
        );
      })
      }
    </tbody>
    );
  }


  return (
    
        <Text> past list </Text>
    
  )
  }

export default PastEvent;