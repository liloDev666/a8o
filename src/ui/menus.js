// Modern UI Menus for 2026

export function getMainMenu() {
  return {
    inline_keyboard: [
      [
        { text: '👥 Members', callback_data: 'menu_members' },
        { text: '⚔️ Battles', callback_data: 'menu_battles' }
      ],
      [
        { text: '📊 Stats', callback_data: 'menu_stats' },
        { text: '🎮 Games', callback_data: 'menu_games' }
      ],
      [
        { text: '📅 Events', callback_data: 'menu_events' },
        { text: '🔔 Alerts', callback_data: 'menu_alerts' }
      ],
      [
        { text: '🌍 Language', callback_data: 'menu_language' },
        { text: '⚙️ Settings', callback_data: 'menu_settings' }
      ],
      [
        { text: '❓ Help', callback_data: 'menu_help' }
      ]
    ]
  };
}

export function getMembersMenu() {
  return {
    inline_keyboard: [
      [
        { text: '📝 Register', callback_data: 'action_register' },
        { text: '👤 My Profile', callback_data: 'action_profile' }
      ],
      [
        { text: '📋 Member List', callback_data: 'action_members' },
        { text: '🏆 Leaderboard', callback_data: 'action_leaderboard' }
      ],
      [
        { text: '👑 Roles', callback_data: 'action_roles' },
        { text: '⭐ My Role', callback_data: 'action_myrole' }
      ],
      [
        { text: '🔙 Back', callback_data: 'menu_main' }
      ]
    ]
  };
}

export function getBattlesMenu() {
  return {
    inline_keyboard: [
      [
        { text: '⚔️ Log Battle', callback_data: 'action_addbattle' },
        { text: '📜 Battle History', callback_data: 'action_battles' }
      ],
      [
        { text: '🎯 Add Target', callback_data: 'action_addtarget' },
        { text: '🎯 View Targets', callback_data: 'action_targets' }
      ],
      [
        { text: '🏰 War Coordination', callback_data: 'action_war' },
        { text: '🏆 Achievements', callback_data: 'action_achievements' }
      ],
      [
        { text: '🔙 Back', callback_data: 'menu_main' }
      ]
    ]
  };
}

export function getStatsMenu() {
  return {
    inline_keyboard: [
      [
        { text: '📊 Guild Stats', callback_data: 'action_stats' },
        { text: '📈 Advanced Stats', callback_data: 'action_advstats' }
      ],
      [
        { text: '📉 Might Chart', callback_data: 'action_chart' },
        { text: '📊 Activity Chart', callback_data: 'action_activity' }
      ],
      [
        { text: '📦 Resources', callback_data: 'action_resources' },
        { text: '➕ Add Resource', callback_data: 'action_addresource' }
      ],
      [
        { text: '🔙 Back', callback_data: 'menu_main' }
      ]
    ]
  };
}

export function getGamesMenu() {
  return {
    inline_keyboard: [
      [
        { text: '🎮 Play Mini-Game', callback_data: 'action_game' },
        { text: '🏆 Leaderboard', callback_data: 'action_leaderboard' }
      ],
      [
        { text: '🎯 Start Contest', callback_data: 'action_startcontest' },
        { text: '📊 Contest Scores', callback_data: 'action_contestscores' }
      ],
      [
        { text: '🎲 Random Challenge', callback_data: 'action_challenge' }
      ],
      [
        { text: '🔙 Back', callback_data: 'menu_main' }
      ]
    ]
  };
}

export function getEventsMenu() {
  return {
    inline_keyboard: [
      [
        { text: '📅 Upcoming Events', callback_data: 'action_events' },
        { text: '➕ Create Event', callback_data: 'action_addevent' }
      ],
      [
        { text: '⏰ Set Reminder', callback_data: 'action_remind' },
        { text: '🔔 My Reminders', callback_data: 'action_myreminders' }
      ],
      [
        { text: '🔙 Back', callback_data: 'menu_main' }
      ]
    ]
  };
}

export function getAlertsMenu() {
  return {
    inline_keyboard: [
      [
        { text: '🐉 Monster Alert', callback_data: 'action_monster' },
        { text: '🏰 Darknest Alert', callback_data: 'action_darknest' }
      ],
      [
        { text: '🔔 Subscribe', callback_data: 'action_subscribe' },
        { text: '🔕 Unsubscribe', callback_data: 'action_unsubscribe' }
      ],
      [
        { text: '📸 Scan Screenshot', callback_data: 'action_scan' }
      ],
      [
        { text: '🔙 Back', callback_data: 'menu_main' }
      ]
    ]
  };
}

export function getLanguageMenu() {
  return {
    inline_keyboard: [
      [
        { text: '🇬🇧 English', callback_data: 'lang_en' },
        { text: '🇷🇺 Русский', callback_data: 'lang_ru' }
      ],
      [
        { text: '🇸🇦 العربية', callback_data: 'lang_ar' },
        { text: '🇫🇷 Français', callback_data: 'lang_fr' }
      ],
      [
        { text: '🇪🇸 Español', callback_data: 'lang_es' },
        { text: '🇵🇹 Português', callback_data: 'lang_pt' }
      ],
      [
        { text: '🇩🇪 Deutsch', callback_data: 'lang_de' },
        { text: '🇨🇳 中文', callback_data: 'lang_zh' }
      ],
      [
        { text: '🌍 Auto-Translate', callback_data: 'action_translateon' }
      ],
      [
        { text: '🔙 Back', callback_data: 'menu_main' }
      ]
    ]
  };
}

export function getSettingsMenu() {
  return {
    inline_keyboard: [
      [
        { text: '🏰 Guild Info', callback_data: 'action_guildinfo' },
        { text: '👑 Roles', callback_data: 'action_roles' }
      ],
      [
        { text: '🌍 Language', callback_data: 'menu_language' },
        { text: '🔔 Notifications', callback_data: 'action_notifications' }
      ],
      [
        { text: '📊 Export Data', callback_data: 'action_export' },
        { text: '❓ Help', callback_data: 'menu_help' }
      ],
      [
        { text: '🔙 Back', callback_data: 'menu_main' }
      ]
    ]
  };
}

export function getQuickActionsMenu() {
  return {
    inline_keyboard: [
      [
        { text: '⚔️ Quick Battle', callback_data: 'quick_battle' },
        { text: '📦 Quick Resource', callback_data: 'quick_resource' }
      ],
      [
        { text: '🎯 Quick Target', callback_data: 'quick_target' },
        { text: '📅 Quick Event', callback_data: 'quick_event' }
      ],
      [
        { text: '📊 Quick Stats', callback_data: 'action_stats' }
      ]
    ]
  };
}

export function getConfirmationMenu(action, id) {
  return {
    inline_keyboard: [
      [
        { text: '✅ Confirm', callback_data: `confirm_${action}_${id}` },
        { text: '❌ Cancel', callback_data: 'cancel' }
      ]
    ]
  };
}

export function getPaginationMenu(page, totalPages, prefix) {
  const buttons = [];
  
  if (page > 1) {
    buttons.push({ text: '⬅️ Previous', callback_data: `${prefix}_${page - 1}` });
  }
  
  buttons.push({ text: `📄 ${page}/${totalPages}`, callback_data: 'noop' });
  
  if (page < totalPages) {
    buttons.push({ text: 'Next ➡️', callback_data: `${prefix}_${page + 1}` });
  }
  
  return {
    inline_keyboard: [
      buttons,
      [{ text: '🔙 Back', callback_data: 'menu_main' }]
    ]
  };
}

export function getWarCoordinationMenu() {
  return {
    inline_keyboard: [
      [
        { text: '✅ I\'m Ready', callback_data: 'war_ready' },
        { text: '❌ Can\'t Make It', callback_data: 'war_absent' }
      ],
      [
        { text: '🛡️ Defense Team', callback_data: 'war_defense' },
        { text: '⚔️ Attack Team', callback_data: 'war_attack' }
      ],
      [
        { text: '🏥 Support Team', callback_data: 'war_support' },
        { text: '🎯 Scout Team', callback_data: 'war_scout' }
      ],
      [
        { text: '📊 War Stats', callback_data: 'action_warstats' }
      ]
    ]
  };
}

export function getEventParticipationMenu(eventId) {
  return {
    inline_keyboard: [
      [
        { text: '✅ I\'ll Join', callback_data: `event_join_${eventId}` },
        { text: '❌ Can\'t Join', callback_data: `event_skip_${eventId}` }
      ],
      [
        { text: '⏰ Remind Me', callback_data: `remind_${eventId}` },
        { text: '📍 Share Location', callback_data: `event_location_${eventId}` }
      ]
    ]
  };
}

export function getBattleReactionMenu(battleId) {
  return {
    inline_keyboard: [
      [
        { text: '👍 Nice!', callback_data: `battle_like_${battleId}` },
        { text: '🔥 Epic!', callback_data: `battle_epic_${battleId}` },
        { text: '💪 Beast!', callback_data: `battle_beast_${battleId}` }
      ],
      [
        { text: '📊 Details', callback_data: `battle_details_${battleId}` }
      ]
    ]
  };
}

export function getTargetActionMenu(targetId) {
  return {
    inline_keyboard: [
      [
        { text: '🎯 I\'ll Attack', callback_data: `target_claim_${targetId}` },
        { text: '👀 Scout First', callback_data: `target_scout_${targetId}` }
      ],
      [
        { text: '✅ Eliminated', callback_data: `target_eliminate_${targetId}` },
        { text: '📊 Info', callback_data: `target_info_${targetId}` }
      ]
    ]
  };
}
