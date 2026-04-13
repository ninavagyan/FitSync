package com.clubflow.app.data.repository

import com.clubflow.app.data.remote.ClubFlowApi
import com.clubflow.app.data.remote.dto.TrainingDto
import com.clubflow.app.data.session.SessionStore
import com.clubflow.app.domain.model.Training
import com.clubflow.app.domain.model.TrainingCategory
import com.clubflow.app.domain.model.TrainingStatus
import com.clubflow.app.domain.repository.TrainingRepository
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.datetime.Instant

@Singleton
class ApiTrainingRepository @Inject constructor(
    private val api: ClubFlowApi,
    private val sessionStore: SessionStore,
) : TrainingRepository {
    private val trainings = MutableStateFlow(emptyList<Training>())

    override fun observeUpcomingTrainings(): Flow<List<Training>> = trainings

    override suspend fun refreshTrainings() {
        val token = sessionStore.observeSession().value?.token ?: throw IllegalStateException("Please log in first.")
        trainings.value = api.fetchUpcomingTrainings(token).map(TrainingDto::toDomain)
    }

    override suspend fun bookTraining(trainingId: String): Result<Unit> {
        return runCatching {
            val token = sessionStore.observeSession().value?.token ?: throw IllegalStateException("Please log in first.")
            val updated = api.bookTraining(token = token, trainingId = trainingId).toDomain()
            trainings.update { current -> current.map { if (it.id == updated.id) updated else it } }
        }
    }

    override suspend fun cancelBooking(trainingId: String): Result<Unit> {
        return runCatching {
            val token = sessionStore.observeSession().value?.token ?: throw IllegalStateException("Please log in first.")
            val updated = api.cancelBooking(token = token, trainingId = trainingId).toDomain()
            trainings.update { current -> current.map { if (it.id == updated.id) updated else it } }
        }
    }
}

private fun TrainingDto.toDomain(): Training {
    return Training(
        id = id,
        name = name,
        description = description,
        category = category.toTrainingCategory(),
        startsAt = Instant.parse(startAt),
        endsAt = Instant.parse(endAt),
        capacity = capacity,
        bookedCount = bookedCount,
        isUserBooked = isUserBooked,
        instructorName = trainerName,
        status = status.toTrainingStatus(),
    )
}

private fun String.toTrainingCategory(): TrainingCategory {
    return when (this) {
        "pilates" -> TrainingCategory.PILATES
        "yoga" -> TrainingCategory.YOGA
        else -> TrainingCategory.GROUP_TRAINING
    }
}

private fun String.toTrainingStatus(): TrainingStatus {
    return when (this) {
        "full" -> TrainingStatus.FULL
        "cancelled" -> TrainingStatus.CANCELLED
        "expired" -> TrainingStatus.EXPIRED
        else -> TrainingStatus.SCHEDULED
    }
}
