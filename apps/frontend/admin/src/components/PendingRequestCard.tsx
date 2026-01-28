import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Spacing, useTheme } from '@time-sync/ui';
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
  const { colors } = useTheme();
  
  const startDate = new Date(request.startDate);
  const endDate = new Date(request.endDate);
  const numberOfDays = differenceInCalendarDays(endDate, startDate) + 1;
  const initials = getInitials(request.user?.firstName, request.user?.lastName);
  const avatarColor = getAvatarColor(request.user?.firstName);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      
      {/* Left: Avatar */}
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      {/* Center: Info */}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
          {request.user?.firstName} {request.user?.lastName}
        </Text>
        
        {/* Tags Row */}
        <View style={styles.tagsRow}>
          <View style={[styles.tag, { backgroundColor: colors.primary[100] }]}>
            <Text style={[styles.tagText, { color: colors.primary[500] }]}>{request.type}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: 'hsl(142, 70%, 95%)' }]}>
            <Text style={[styles.tagText, { color: 'hsl(142, 70%, 45%)' }]}>
              {numberOfDays} {numberOfDays === 1 ? 'Day' : 'Days'}
            </Text>
          </View>
        </View>

        <Text style={[styles.dateRange, { color: colors.textSecondary }]}>
          {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
        </Text>

        <Text style={[styles.submitted, { color: colors.textSecondary }]}>
          Submitted on {format(new Date(request.createdAt), 'MMM d, yyyy')}
        </Text>
      </View>

      <View style={styles.actionsColumn}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.acceptBtn, { backgroundColor: colors.primary[500] }]} 
          onPress={() => onApprove(request.id)}
        >
          <Text style={[styles.actionText, { color: '#fff' }]}>Accept</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionBtn, styles.rejectBtn, { borderColor: colors.semantic.error }]} 
          onPress={() => onReject(request.id)}
        >
          <Text style={[styles.actionText, { color: colors.semantic.error }]}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: '#999',
    borderRadius: 16,
    padding: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dateRange: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  submitted: {
    fontSize: 11,
  },
  actionsColumn: {
    flexDirection: 'column',
    gap: Spacing.md,
    width: 100,
  },
  actionBtn: {
    height: 50,
    minWidth: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  acceptBtn: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

