import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { Colors } from "../constants/Colors";
import Icon from "@react-native-vector-icons/fontawesome6";
import { Fonts } from "../constants/Fonts";

interface DropdownOption<T> {
  value: T;
  label: string;
}

interface DropdownProps<T> {
  options: DropdownOption<T>[];
  onSelect: (option: DropdownOption<T>) => void;
  selectedValue?: T;
  placeholder?: string;
}

const DropdownMenu = <T extends string | number>({
  options,
  onSelect,
  selectedValue,
  placeholder = "Select an option",
}: DropdownProps<T>) => {
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find(option => option.value === selectedValue)
  const handleSelect = (option: DropdownOption<T>) => {
    onSelect(option);
    setVisible(false);
  };

  const closeDropdown = (event: GestureResponderEvent) => {
    event.stopPropagation();
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Dropdown Button */}
      <TouchableOpacity activeOpacity={0.9} style={styles.dropdownButton} onPress={() => {options.length > 0 ? setVisible(true) : null}}>
        <Text style={styles.buttonText}>{selectedOption?.label ?? placeholder}</Text>
        <Icon name={visible ? "chevron-up" : "chevron-down"} iconStyle="solid" size={20} color={Colors.grey}/>
      </TouchableOpacity>

      {/* Modal for Dropdown */}
      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDropdown}>
          <View style={styles.dropdown}>
            {options.length > 0 ? <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={0.9} style={styles.option} onPress={() => handleSelect(item)}>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />: 
              <Text style={{textAlign: 'center', marginTop: 30 }}>{placeholder}</Text>
            }
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  dropdownButton: {
    width: '100%',
    padding: 12,
    backgroundColor: Colors.whitesmoke,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    color: Colors.black,
    fontSize: Fonts.fs_16,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  dropdown: {
    height: 300,
    width: '80%',
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  option: {
    padding: 10,
    //alignItems: "center",
    borderColor: Colors.light_grey,
    borderBottomWidth: 1
  },
  optionText: {
    fontSize: Fonts.fs_16,
    color: "#333",
  },
  appContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DropdownMenu;
