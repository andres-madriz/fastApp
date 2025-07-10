import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import CustomCheckbox from './CustomCheckbox';

type GroceryItem = {
  id: string;
  name: string;
  checked: boolean;
};

type Props = {
  items: GroceryItem[];
  onAdd: (name: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string, newName: string) => void;
};

export default function GroceriesChecklist({
  items,
  onAdd,
  onDelete,
  onToggle,
  onEdit,
}: Props) {
  const [newItem, setNewItem] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  // --- Icon image imports
  const editImg = require('../assets/images/edit.png');
  const deleteImg = require('../assets/images/delete.png');
  const checkImg = require('../assets/images/check.png');
  const closeImg = require('../assets/images/close.png');

  const startEdit = (item: GroceryItem) => {
    setEditingId(item.id);
    setEditingValue(item.name);
  };

  const saveEdit = (id: string) => {
    if (editingValue.trim()) {
      if (onEdit) onEdit(id, editingValue.trim());
    }
    setEditingId(null);
    setEditingValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Groceries Checklist</Text>
      <View style={styles.inputRow}>
        <CustomInput
          placeholder="Add grocery item"
          value={newItem}
          onChangeText={setNewItem}
          onSubmitEditing={() => {
            if (newItem.trim()) {
              onAdd(newItem.trim());
              setNewItem('');
            }
          }}
        />
        <CustomButton
          title="Add"
          onPress={() => {
            if (newItem.trim()) {
              onAdd(newItem.trim());
              setNewItem('');
            }
          }}
        />
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <CustomCheckbox checked={item.checked} onToggle={() => onToggle(item.id)} />
            {editingId === item.id ? (
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <CustomInput
                  value={editingValue}
                  onChangeText={setEditingValue}
                  style={{
                    flex: 1,
                    marginRight: 5,
                    minWidth: 40,
                    borderWidth: 2,
                   /*  borderColor: '#0a7ea4', */
                    borderRadius: 8,
                    /* backgroundColor: '#e6f6fb', */
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                  }}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={() => saveEdit(item.id)}
                  style={[styles.iconBtn, styles.greenOutline]}
                >
                  <Image source={checkImg} style={styles.icon} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={cancelEdit}
                  style={[styles.iconBtn, styles.redOutline]}
                >
                  <Image source={closeImg} style={styles.icon} resizeMode="contain" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text
                  style={[
                    styles.itemText,
                    {
                      color: item.checked ? '#9BA1A6' : '#11181C',
                      textDecorationLine: item.checked ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {item.name}
                </Text>
                <TouchableOpacity
                  style={[styles.iconBtn/* , { borderColor: '#eab308' } */]}
                  onPress={() => startEdit(item)}
                >
                  <Image source={editImg} style={styles.icon} resizeMode="contain" />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={[styles.iconBtn, styles.redOutline]} onPress={() => onDelete(item.id)}>
              <Image source={deleteImg} style={styles.icon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 12, margin: 12, padding: 18/* , backgroundColor: '#f8f9fa' */ },
  deleteBtn: { backgroundColor: '#ef4444', marginLeft: 6 },
  inputRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 12 },
  itemRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 10 },
  itemText: { flex: 1, fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 14 },
  iconBtn: {
    padding: 4,
    borderWidth: 2,
    borderRadius: 7,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
  },
  greenOutline: {
    borderColor: '#16a34a',
  },
  redOutline: {
    borderColor: '#ef4444',
  },
});
