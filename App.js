import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const key =
  'Wp08bfxT%2BVGt3ynwqmf61h36xI03R4S1PAD%2Bi30O1b8fYBZHkUYF5XRoGhQXAUP71BtBcrnrw286O3EQCiSyUw%3D%3D';
const date = new Date();
const year = date.getFullYear();
const month = ('0' + (1 + date.getMonth())).slice(-2);
const day = ('0' + date.getDate()).slice(-2);
const today = year + month + day;

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([]);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${key}&pageNo=1&numOfRows=230&dataType=JSON&base_date=${today}&base_time=0500&nx=${[
        parseInt(latitude),
      ]}&ny=${parseInt(longitude)}`
    );
    const json = await response.json();
    setDays(json.response.body.items.item.filter((d) => d.category == 'TMP'));
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
        <Text style={styles.date}>{`${year}년 ${month}월 ${day}일`}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length == 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color='white' size='large' />
          </View>
        ) : (
          days.map((d, i) => (
            <View key={i} style={styles.day}>
              <Text style={styles.temperature}>{d.fcstValue}°C</Text>
              <Text style={styles.hours}>
                {('0' + d.fcstTime / 100).slice(-2)}시
                {('0' + (d.fcstTime % 100)).slice(-2)}분
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style='light' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'skyblue',
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    color: 'white',
    fontSize: 58,
    fontWeight: '500',
  },
  date: {
    color: 'white',
    marginTop: 20,
    fontSize: 20,
    fontWeight: '400',
  },
  day: {
    width: SCREEN_WIDTH,
  },
  temperature: {
    marginTop: 30,
    marginLeft: 20,
    fontSize: 128,
    color: 'white',
  },
  hours: {
    fontSize: 30,
    marginLeft: 30,
    color: 'white',
  },
});
