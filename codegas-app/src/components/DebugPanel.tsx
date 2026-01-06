import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEBUG_LOG_KEY = '@debug_logs';
const MAX_LOGS = 100;

interface LogEntry {
    timestamp: number;
    level: 'log' | 'warn' | 'error' | 'info';
    message: string;
    data?: any;
}

class DebugLogger {
    private logs: LogEntry[] = [];
    private listeners: ((logs: LogEntry[]) => void)[] = [];

    async init() {
        try {
            const storedLogs = await AsyncStorage.getItem(DEBUG_LOG_KEY);
            if (storedLogs) {
                this.logs = JSON.parse(storedLogs);
                // Mantener solo los últimos MAX_LOGS
                if (this.logs.length > MAX_LOGS) {
                    this.logs = this.logs.slice(-MAX_LOGS);
                    await this.saveLogs();
                }
            }
        } catch (error) {
            console.error('Error cargando logs:', error);
        }
    }

    private async saveLogs() {
        try {
            await AsyncStorage.setItem(DEBUG_LOG_KEY, JSON.stringify(this.logs));
        } catch (error) {
            console.error('Error guardando logs:', error);
        }
    }

    log(message: string, data?: any) {
        this.addLog('log', message, data);
    }

    warn(message: string, data?: any) {
        this.addLog('warn', message, data);
    }

    error(message: string, data?: any) {
        this.addLog('error', message, data);
    }

    info(message: string, data?: any) {
        this.addLog('info', message, data);
    }

    private async addLog(level: LogEntry['level'], message: string, data?: any) {
        const entry: LogEntry = {
            timestamp: Date.now(),
            level,
            message,
            data
        };

        this.logs.push(entry);

        // Mantener solo los últimos MAX_LOGS
        if (this.logs.length > MAX_LOGS) {
            this.logs = this.logs.slice(-MAX_LOGS);
        }

        await this.saveLogs();
        this.notifyListeners();

        // También mostrar en console normal
        const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
        consoleMethod(`[${level.toUpperCase()}] ${message}`, data || '');
    }

    subscribe(listener: (logs: LogEntry[]) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener([...this.logs]));
    }

    getLogs(): LogEntry[] {
        return [...this.logs];
    }

    async clearLogs() {
        this.logs = [];
        await AsyncStorage.removeItem(DEBUG_LOG_KEY);
        this.notifyListeners();
    }
}

export const debugLogger = new DebugLogger();

interface DebugPanelProps {
    visible: boolean;
    onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ visible, onClose }) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'info' | 'log'>('all');

    useEffect(() => {
        if (visible) {
            setLogs(debugLogger.getLogs());
            const unsubscribe = debugLogger.subscribe((newLogs) => {
                setLogs(newLogs);
            });
            return unsubscribe;
        }
    }, [visible]);

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.level === filter);

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const getLogColor = (level: LogEntry['level']) => {
        switch (level) {
            case 'error': return '#dc3545';
            case 'warn': return '#ffc107';
            case 'info': return '#17a2b8';
            default: return '#6c757d';
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Debug Logs</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={() => setFilter(filter === 'all' ? 'error' : filter === 'error' ? 'warn' : filter === 'warn' ? 'info' : filter === 'info' ? 'log' : 'all')}
                        >
                            <Text style={styles.filterButtonText}>
                                {filter === 'all' ? 'Todos' : filter === 'error' ? 'Errores' : filter === 'warn' ? 'Warnings' : filter === 'info' ? 'Info' : 'Logs'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={async () => {
                                await debugLogger.clearLogs();
                                setLogs([]);
                            }}
                        >
                            <Text style={styles.clearButtonText}>Limpiar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <FontAwesome name="times" style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Logs */}
                <ScrollView style={styles.logsContainer} contentContainerStyle={styles.logsContent}>
                    {filteredLogs.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay logs disponibles</Text>
                        </View>
                    ) : (
                        filteredLogs.map((log, index) => (
                            <View key={index} style={styles.logEntry}>
                                <View style={styles.logHeader}>
                                    <Text style={[styles.logLevel, { color: getLogColor(log.level) }]}>
                                        {log.level.toUpperCase()}
                                    </Text>
                                    <Text style={styles.logTime}>{formatTime(log.timestamp)}</Text>
                                </View>
                                <Text style={styles.logMessage}>{log.message}</Text>
                                {log.data && (
                                    <Text style={styles.logData}>
                                        {typeof log.data === 'object' ? JSON.stringify(log.data, null, 2) : String(log.data)}
                                    </Text>
                                )}
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''} {filter === 'all' ? '' : `(${filter})`}
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#002587',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    filterButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    filterButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    clearButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    closeButton: {
        marginLeft: 8,
    },
    closeIcon: {
        fontSize: 20,
        color: '#fff',
    },
    logsContainer: {
        flex: 1,
    },
    logsContent: {
        padding: 12,
    },
    logEntry: {
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        borderLeftWidth: 4,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    logLevel: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    logTime: {
        fontSize: 10,
        color: '#6c757d',
    },
    logMessage: {
        fontSize: 13,
        color: '#212529',
        marginBottom: 4,
        fontFamily: 'monospace',
    },
    logData: {
        fontSize: 11,
        color: '#6c757d',
        fontFamily: 'monospace',
        marginTop: 4,
        backgroundColor: '#f8f9fa',
        padding: 8,
        borderRadius: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#6c757d',
    },
    footer: {
        backgroundColor: '#e9ecef',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#dee2e6',
    },
    footerText: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
    },
});

export default DebugPanel;

