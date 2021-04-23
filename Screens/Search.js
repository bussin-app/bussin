import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, FlatList, StatusBar, Button } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Picker } from '@react-native-community/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Search = (props) => {
  const [token, setToken] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [status, setStatus] = useState("events");

  const fetchData = async () => {
    let storedToken = await AsyncStorage.getItem('@bussin-token');
    if (!storedToken) return;
    setToken(storedToken);

    let source = `${status.substr(0, status.length - 1)}/all`;
    let response = await fetch(`https://bussin.blakekjohnson.dev/api/${source}`, {
      headers: {
        'Authorization': `Bearer ${storedToken}`,
      }
    });

    // Convert response to JSON
    response = await response.json();

    // Set data sources
    setFilteredDataSource(response.items);
    setMasterDataSource(response.items);
  };

  const focusWrapper = () => {
    setStatus('events');
  };

  useEffect(() => {
    props.navigation.addListener('focus', focusWrapper);
  }, []);

  useEffect(() => {
    fetchData();
  }, [status]);

  const changeStatus = (status) => {
    if (status == 'events') {
      setStatus('users');
      return;
    } else if (status == 'users') {
      setStatus('organizations');
      return;
    } else if (status == 'organizations') {
      setStatus('events');
      return;
    }
  }

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };
  const formatDate = (date) => {
    if (date == undefined) {
      return '';
    }

    let dateParts = date.split("-");
    let year = dateParts[0];
    let monthNum = dateParts[1];
    let curDate = dateParts[2].substring(0,2);
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    let formattedString =month[monthNum - 1] + " " + curDate + ", " + year;
    return formattedString;
  }

  const SPACING = 20;
  const ItemView = ({ item }) => {
    return (
      <View style={{
        flexDirection: 'column', padding: SPACING, marginBottom: SPACING, fontFamily: 'HelveticaNeue', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 12,
        shadowColor:"#355070",
        shadowOffset: {
          width: 0,
          height: 10
        },
        shadowOpacity: .3,
        shadowRadius: 20
      }}>
        <Text style={{ fontSize: 25, fontWeight: "200", color: '#B92126' }} onPress={() => getItem(item)}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 20 }}>
          {item.description || item.username || ""}
        </Text>
        <Text style={{ fontSize: 15, textAlign: 'right' }}>
          {formatDate(item.date) || item.eventPoints || ""}
        </Text>
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const getItem = (item) => {
    if (status == 'events')
      props.navigation.navigate('ViewEvent', { event: item });
    else if ((status == 'users'))
      props.navigation.navigate('viewUserProfile', { user: item });
    else
      props.navigation.navigate('ViewOrg', { organization: item });
  };

  if (!token) {
    return <View><Text>To get started login at the user page.</Text></View>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center' }}>
        <Button title={ (status == 'events')?"Events":
        ((status == 'users')?"Users":"Organizations"
        )} onPress = {() => changeStatus(status)} />
      </View>
      <View>
        <SearchBar
          round
          searchIcon={{ size: 24 }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction('')}
          placeholder="Type Here..."
          value={search}
          lightTheme={true}
        />
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          contentContainerStyle={{
            padding: SPACING,
            paddingTop: StatusBar.currentHeight || 42
          }}
          renderItem={ItemView}
        />
      </View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  itemStyle: {
    padding: 10,
  },
});

export default Search;
