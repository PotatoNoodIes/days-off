import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, parseLocalDate } from '@time-sync/ui';
import { createStyles } from '../styles/components/PendingRequestCard.styles';
import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format, differenceInCalendarDays } from 'date-fns';

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
  };
}

interface PendingRequestCardProps {
  request: LeaveRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

// Generate initials for avatar
const getInitials = (firstName?: string, lastName?: string) => {
  return `${(firstName || '?')[0]}${(lastName || '?')[0]}`.toUpperCase();
};

// Generate a color based on name for avatar background
const getAvatarColor = (firstName?: string) => {
  const avatarColors = [
    'hsl(217, 91%, 60%)', // Royal Blue
    'hsl(199, 89%, 48%)', // Cyan
    'hsl(142, 70%, 45%)', // Emerald
    'hsl(38, 92%, 50%)',  // Amber
    'hsl(280, 82%, 60%)', // Purple
  ];
  const charCode = (firstName || 'A').charCodeAt(0);
  return avatarColors[charCode % avatarColors.length];
};

export const PendingRequestCard = ({ request, onApprove, onReject }: PendingRequestCardProps) => {
  const { colors, isDark } = useTheme();
  
  const startDate = parseLocalDate(request.startDate);
  const endDate = parseLocalDate(request.endDate);
  const numberOfDays = differenceInCalendarDays(endDate, startDate) + 1;
  const initials = getInitials(request.user?.firstName, request.user?.lastName);
  const avatarColor = getAvatarColor(request.user?.firstName);

  const styles = useMemo(() => createStyles(colors, !!isDark, avatarColor), [colors, isDark, avatarColor]);

  return (
    <View style={styles.card}>
      
      {/* Left: Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
 
      {/* Center: Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {request.user?.firstName} {request.user?.lastName}
        </Text>
        
        {/* Tags Row */}
        <View style={styles.tagsRow}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>{request.type}</Text>
          </View>
          <View style={styles.daysTag}>
            <Text style={styles.daysTagText}>
              {numberOfDays} {numberOfDays === 1 ? 'Day' : 'Days'}
            </Text>
          </View>
        </View>
 
        <Text style={styles.dateRange}>
          {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
        </Text>
 
        <Text style={styles.submitted}>
          Submitted on {format(new Date(request.createdAt), 'MMM d, yyyy')}
        </Text>
      </View>

      <View style={styles.actionsColumn}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.acceptBtn]} 
          onPress={() => onApprove(request.id)}
        >
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionBtn, styles.rejectBtn]} 
          onPress={() => onReject(request.id)}
        >
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



