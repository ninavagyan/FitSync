package com.clubflow.app.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.clubflow.app.domain.model.Training
import com.clubflow.app.domain.repository.AuthRepository
import com.clubflow.app.domain.repository.TrainingRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class HomeUiState(
    val isRefreshing: Boolean = false,
    val customerName: String = "",
    val trainings: List<Training> = emptyList(),
    val message: String? = null,
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    authRepository: AuthRepository,
    private val trainingRepository: TrainingRepository,
) : ViewModel() {
    private val refreshState = MutableStateFlow(false)
    private val messageState = MutableStateFlow<String?>(null)
    val uiState: StateFlow<HomeUiState> = combine(
        authRepository.observeSession(),
        trainingRepository.observeUpcomingTrainings(),
        refreshState,
        messageState,
    ) { session, trainings, isRefreshing, message ->
        HomeUiState(
            isRefreshing = isRefreshing,
            customerName = session?.fullName.orEmpty(),
            trainings = trainings,
            message = message,
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5_000),
        initialValue = HomeUiState(),
    )

    fun refresh() {
        viewModelScope.launch {
            runRefreshing {
                trainingRepository.refreshTrainings()
            }
        }
    }

    fun bookTraining(trainingId: String) {
        viewModelScope.launch {
            val result = trainingRepository.bookTraining(trainingId)
            messageState.value = result.exceptionOrNull()?.message ?: "Booking confirmed."
        }
    }

    fun cancelBooking(trainingId: String) {
        viewModelScope.launch {
            val result = trainingRepository.cancelBooking(trainingId)
            messageState.value = result.exceptionOrNull()?.message ?: "Booking cancelled."
        }
    }

    fun clearMessage() {
        messageState.value = null
    }

    private suspend fun runRefreshing(block: suspend () -> Unit) {
        refreshState.value = true
        try {
            block()
        } catch (error: Exception) {
            messageState.value = error.message
        } finally {
            refreshState.value = false
        }
    }
}
