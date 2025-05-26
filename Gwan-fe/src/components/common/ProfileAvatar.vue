<template>
  <div class="profile-avatar" :style="{ width: avatarSize, height: avatarSize }">
    <img 
      :src="avatarSrc" 
      :alt="`${userTypeLabel} 프로필`"
      :style="{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }"
    />
  </div>
</template>

<script>
import userAvatar from '@/assets/profile-user.svg'
import adminAvatar from '@/assets/profile-admin.svg'
import prescriberAvatar from '@/assets/profile-prescriber.svg'

export default {
  name: 'ProfileAvatar',
  props: {
    userType: {
      type: String,
      default: 'user',
      validator: (value) => ['user', 'admin', 'prescriber'].includes(value)
    },
    size: {
      type: [String, Number],
      default: 80
    }
  },
  computed: {
    avatarSrc() {
      const avatarMap = {
        user: userAvatar,
        admin: adminAvatar,
        prescriber: prescriberAvatar
      }
      return avatarMap[this.userType] || avatarMap.user
    },
    avatarSize() {
      return typeof this.size === 'number' ? `${this.size}px` : this.size
    },
    userTypeLabel() {
      const labelMap = {
        user: '일반 사용자',
        admin: '관리자',
        prescriber: '처방사'
      }
      return labelMap[this.userType] || '사용자'
    }
  }
}
</script>

<style scoped>
.profile-avatar {
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
}
</style> 