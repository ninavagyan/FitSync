package com.clubflow.app.data.session

import android.content.SharedPreferences
import com.clubflow.app.domain.model.AuthSession
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

@Singleton
class SessionStore @Inject constructor(
    private val preferences: SharedPreferences,
) {
    private val sessionState = MutableStateFlow(loadSession())

    fun observeSession(): StateFlow<AuthSession?> = sessionState

    fun saveSession(session: AuthSession) {
        preferences.edit()
            .putString(KEY_TOKEN, session.token)
            .putString(KEY_USER_ID, session.userId)
            .putString(KEY_FULL_NAME, session.fullName)
            .putString(KEY_EMAIL, session.email)
            .apply()
        sessionState.value = session
    }

    fun clear() {
        preferences.edit().clear().apply()
        sessionState.value = null
    }

    private fun loadSession(): AuthSession? {
        val token = preferences.getString(KEY_TOKEN, null) ?: return null
        val userId = preferences.getString(KEY_USER_ID, null) ?: return null
        val fullName = preferences.getString(KEY_FULL_NAME, null) ?: return null
        val email = preferences.getString(KEY_EMAIL, null) ?: return null
        return AuthSession(
            token = token,
            userId = userId,
            fullName = fullName,
            email = email,
        )
    }

    private companion object {
        const val KEY_TOKEN = "auth_token"
        const val KEY_USER_ID = "auth_user_id"
        const val KEY_FULL_NAME = "auth_full_name"
        const val KEY_EMAIL = "auth_email"
    }
}
