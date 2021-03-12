import React, { useState, useEffect } from 'react';

// import all the components we are going to use
import { SafeAreaView, Text, StyleSheet, View, FlatList, StatusBar } from 'react-native';
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
  const SPACING = 20;
  const PIC_SIZE = 70
  const ItemView = ({ item }) => {
    return (
      <View style={{
        flexDirection: 'column', padding: SPACING, marginBottom: SPACING, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 12,
        shadowColor: "#962eff",
        shadowOffset: {
          width: 0,
          height: 10
        },
        shadowOpacity: .3,
        shadowRadius: 20
      }}>
        {/* <Image
          source={{ url: 'https://api.unsplash.com/photos/random/?query=party&count=' }}
          style={{ width: PIC_SIZE, height: PIC_SIZ, borderRadius: PIC_SIZE }}
        /> */}
        <Text style={{ fontSize: 15, fontFamily: 'Verdana' }} onPress={() => getItem(item)}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 12, fontFamily: 'Verdana' }}>
          {item.description}
        </Text>
        <Text style={{ fontSize: 12, fontFamily: 'Verdana', textAlign: 'right' }}>
          {item.date}
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
    else
      props.navigation.navigate('viewUserProfile', { user: item });
  };

  if (!token) {
    return <View><Text>To get started login at the user page.</Text></View>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center' }}>
        <Picker
          style={{ height: 50, width: 400 }}
          selectedValue={status}
          onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
        >
          <Picker.Item label="Events" value="events" />
          <Picker.Item label="Users" value="users" />
        </Picker>
      </View>
      <View style={{ marginTop: 160 }}>
        <SearchBar
          round
          searchIcon={{ size: 24 }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction('')}
          placeholder="Type Here..."
          value={search}
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
    backgroundColor: 'white',
  },
  itemStyle: {
    padding: 10,
  },
});

export default Search;
