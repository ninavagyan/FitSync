package com.clubflow.app.data.repository

import com.clubflow.app.data.remote.ClubFlowApi
import com.clubflow.app.data.session.SessionStore
import com.clubflow.app.domain.model.AuthSession
import com.clubflow.app.domain.repository.AuthRepository
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow

@Singleton
class ApiAuthRepository @Inject constructor(
    private val api: ClubFlowApi,
    private val sessionStore: SessionStore,
) : AuthRepository {
    override fun observeSession(): Flow<AuthSession?> = sessionStore.observeSession()

    override suspend fun login(email: String, password: String): Result<Unit> {
        return runCatching {
            val response = api.login(email = email, password = password)
            sessionStore.saveSession(
                AuthSession(
                    token = response.token,
                    userId = response.user.id,
                    fullName = response.user.fullName,
                    email = response.user.email,
                ),
            )
        }
    }

    override suspend fun register(fullName: String, phone: String, email: String, password: String): Result<Unit> {
        return runCatching {
            val response = api.register(fullName = fullName, phone = phone, email = email, password = password)
            sessionStore.saveSession(
                AuthSession(
                    token = response.token,
                    userId = response.user.id,
                    fullName = response.user.fullName,
                    email = response.user.email,
                ),
            )
        }
    }

    override suspend fun logout() {
        sessionStore.clear()
    }
}
