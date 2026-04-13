package com.clubflow.app.domain.repository

import com.clubflow.app.domain.model.AuthSession
import kotlinx.coroutines.flow.Flow

interface AuthRepository {
    fun observeSession(): Flow<AuthSession?>
    suspend fun login(email: String, password: String): Result<Unit>
    suspend fun register(fullName: String, phone: String, email: String, password: String): Result<Unit>
    suspend fun logout()
}
