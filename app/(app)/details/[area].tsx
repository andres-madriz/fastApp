import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';

import type { Task } from '../../../components/LivingAreaChecklist';

import { useSession } from '../../../contexts';
import { db } from '../../../lib/firebase-config';
import TaskItem from '../../../components/TaskItem';
import EditTaskModal from '../../(app)/(modal)/editTask'; // <- Use your new overlay style!
import CreateTaskModal from '../../(app)/(modal)/createTaskModal';

export default function AreaScreen() {
  const { area } = useLocalSearchParams<{ area: string }>();
  const { userDoc } = useSession();
  const homeId = userDoc?.homeId;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // For modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Fetch tasks for this area
  useEffect(() => {
    if (!homeId || !area) return;
    setLoading(true);
    const fetchTasks = async () => {
      const homeRef = doc(db, 'homes', homeId);
      const snap = await getDoc(homeRef);
      const list = snap.exists() ? snap.data().todos?.[area] || [] : [];
      setTasks(list);
      setLoading(false);
    };
    fetchTasks();
  }, [homeId, area]);

  // Update tasks in Firestore and state
  const updateTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    if (homeId && area) {
      await updateDoc(doc(db, 'homes', homeId), {
        [`todos.${area}`]: newTasks,
      });
    }
  };

  // Handle creating a new task
  const handleCreateTask = async ({ deadline, details, name }: { name: string; details: string; deadline: string }) => {
    const newTask: Task = {
      checked: false,
      deadline,
      details,
      id: Date.now().toString(),
      name,
    };
    const newTasks = [...tasks, newTask];
    await updateTasks(newTasks);
    setShowCreateModal(false);
  };

  // Handle editing a task
  const handleEditTask = async (updatedTask: Task) => {
    const newTasks = tasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
    await updateTasks(newTasks);
    setEditTask(null);
  };

  if (!area)
    return (
      <View>
        <Text>Invalid area.</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
          {String(area).charAt(0).toUpperCase() + String(area).slice(1)}
        </Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                area={String(area)}
                onToggle={async () =>
                  updateTasks(tasks.map(t => (t.id === task.id ? { ...t, checked: !t.checked } : t)))
                }
                onDelete={async () => updateTasks(tasks.filter(t => t.id !== task.id))}
                onEdit={() => setEditTask(task)}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowCreateModal(true)}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>

      {/* Create Task Modal */}
      <Modal
        visible={showCreateModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CreateTaskModal
              area={String(area)}
              onCreate={handleCreateTask}
              onCancel={() => setShowCreateModal(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Edit Task Modal */}
      <Modal visible={!!editTask} animationType="fade" transparent onRequestClose={() => setEditTask(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {editTask && <EditTaskModal task={editTask} onSave={handleEditTask} onCancel={() => setEditTask(null)} />}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    backgroundColor: '#0a7ea4',
    borderRadius: 30,
    bottom: 40,
    elevation: 7,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: 30,
    shadowColor: '#222',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    width: 60,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    width: '90%',
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 30, 0.25)',
    flex: 1,
    justifyContent: 'center',
  },
});
