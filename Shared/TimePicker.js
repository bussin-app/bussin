import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import styled from 'styled-components';
import DateTimePicker from '@react-native-community/datetimepicker';


const Container = styled.TouchableOpacity`
  background-color: ${Platform.OS === 'ios' ? '#00000066' : 'transparent'};
  position: absolute;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  align-content: center;
`;
export default class TimePicker extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      time: new Date(this.props.time),
    };
  }
  
  render() {
    const { onClose, onChange } = this.props;
    const { time } = this.state;
    return (
      <Container onPress={onClose}>
        <DateTimePicker
          value={time}
          mode="time"
          display="spinner"
          onChange={(e, t) => {
            if (Platform.OS === 'ios') {
              this.setState({ time: t });
              onChange(t);
            } else {
              onClose(t);
            }
         }}
         style={{ backgroundColor: 'white' }}
       />
     </Container>
   );
  }
}