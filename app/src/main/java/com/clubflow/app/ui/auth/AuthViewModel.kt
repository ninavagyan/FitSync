package com.clubflow.app.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.clubflow.app.domain.model.AuthSession
import com.clubflow.app.domain.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class AuthUiState(
    val isRegisterMode: Boolean = false,
    val isLoading: Boolean = false,
    val fullName: String = "",
    val phone: String = "",
    val email: String = "",
    val password: String = "",
    val message: String? = null,
)

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository,
) : ViewModel() {
    private val mutableState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = mutableState.asStateFlow()
    val sessionState: StateFlow<AuthSession?> = authRepository.observeSession().stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = null,
    )

    fun setRegisterMode(isRegisterMode: Boolean) {
        mutableState.value = mutableState.value.copy(isRegisterMode = isRegisterMode, message = null)
    }

    fun updateFullName(value: String) {
        mutableState.value = mutableState.value.copy(fullName = value)
    }

    fun updatePhone(value: String) {
        mutableState.value = mutableState.value.copy(phone = value)
    }

    fun updateEmail(value: String) {
        mutableState.value = mutableState.value.copy(email = value)
    }

    fun updatePassword(value: String) {
        mutableState.value = mutableState.value.copy(password = value)
    }

    fun clearMessage() {
        mutableState.value = mutableState.value.copy(message = null)
    }

    fun submit() {
        val current = mutableState.value
        viewModelScope.launch {
            mutableState.value = current.copy(isLoading = true, message = null)
            val result = if (current.isRegisterMode) {
                authRepository.register(
                    fullName = current.fullName,
                    phone = current.phone,
                    email = current.email,
                    password = current.password,
                )
            } else {
                authRepository.login(
                    email = current.email,
                    password = current.password,
                )
            }
            mutableState.value = mutableState.value.copy(
                isLoading = false,
                message = result.exceptionOrNull()?.message,
            )
        }
    }

    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
        }
    }
}
