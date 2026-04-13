package com.clubflow.app.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.clubflow.app.domain.model.Training
import com.clubflow.app.domain.model.TrainingCategory
import com.clubflow.app.domain.model.TrainingStatus
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime

@Composable
fun HomeRoute(
    uiState: HomeUiState,
    onRefresh: () -> Unit,
    onBookTraining: (String) -> Unit,
    onCancelBooking: (String) -> Unit,
    onLogout: () -> Unit,
    onMessageShown: () -> Unit,
) {
    HomeScreen(
        uiState = uiState,
        onRefresh = onRefresh,
        onBookTraining = onBookTraining,
        onCancelBooking = onCancelBooking,
        onLogout = onLogout,
        onMessageShown = onMessageShown,
    )
}

@OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    uiState: HomeUiState,
    onRefresh: () -> Unit,
    onBookTraining: (String) -> Unit,
    onCancelBooking: (String) -> Unit,
    onLogout: () -> Unit,
    onMessageShown: () -> Unit,
) {
    val snackbarHostState = remember { SnackbarHostState() }
    val stats = remember(uiState.trainings) { HomeStats.from(uiState.trainings) }

    LaunchedEffect(uiState.message) {
        uiState.message?.let { message ->
            snackbarHostState.showSnackbar(message)
            onMessageShown()
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("ClubFlow")
                        Text(
                            text = if (uiState.customerName.isBlank()) "Customer schedule" else "Welcome, ${uiState.customerName}",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                },
                actions = {
                    Button(onClick = onRefresh, enabled = uiState.isRefreshing == false) {
                        Text("Refresh")
                    }
                    Button(onClick = onLogout, enabled = uiState.isRefreshing == false) {
                        Text("Logout")
                    }
                },
            )
        },
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Brush.verticalGradient(colors = listOf(Color(0xFFF7F2E8), Color(0xFFE6F2EF))))
                .padding(innerPadding),
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                item { HeroCard(stats = stats) }
                item {
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        CategoryChip(label = "Pilates")
                        CategoryChip(label = "Yoga")
                        CategoryChip(label = "Group Training")
                        CategoryChip(label = "Live capacity")
                    }
                }
                items(uiState.trainings, key = Training::id) { training ->
                    TrainingCard(
                        training = training,
                        onBook = { onBookTraining(training.id) },
                        onCancel = { onCancelBooking(training.id) },
                    )
                }
            }

            if (uiState.isRefreshing) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            }
        }
    }
}

@Composable
private fun TrainingCard(
    training: Training,
    onBook: () -> Unit,
    onCancel: () -> Unit,
) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.92f)),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Text(text = training.name, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)
            Text(text = training.category.displayName, style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.primary)
            Text(text = training.description, style = MaterialTheme.typography.bodyMedium)
            TrainingMetaRow(label = "Instructor", value = training.instructorName)
            TrainingMetaRow(
                label = "Time",
                value = buildString {
                    append(training.startsAt.toLocalDateTime(TimeZone.currentSystemDefault()))
                    append(" - ")
                    append(training.endsAt.toLocalDateTime(TimeZone.currentSystemDefault()).time)
                },
            )
            TrainingMetaRow(label = "Availability", value = "${training.availableSeats} seats left of ${training.capacity}")
            TrainingMetaRow(label = "Status", value = training.status.displayName)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = onBook, enabled = training.isBookable) { Text("Book") }
                Button(onClick = onCancel, enabled = training.canCancel) { Text("Cancel") }
            }
        }
    }
}

@Composable
private fun TrainingMetaRow(label: String, value: String) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(text = "$label:", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.primary)
        Text(text = value, style = MaterialTheme.typography.bodyMedium)
    }
}

@Composable
private fun HeroCard(stats: HomeStats) {
    Card(
        shape = RoundedCornerShape(28.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF103A33)),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text(text = "Upcoming trainings", style = MaterialTheme.typography.headlineMedium, color = Color(0xFFF7F2E8), fontWeight = FontWeight.Bold)
            Text(
                text = "Live customer mode is enabled. These sessions now come from the shared backend API.",
                style = MaterialTheme.typography.bodyLarge,
                color = Color(0xFFD7EAE4),
            )
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StatTile(label = "Sessions", value = stats.totalTrainings.toString())
                StatTile(label = "Booked", value = stats.bookedByUser.toString())
                StatTile(label = "Open seats", value = stats.openSeats.toString())
            }
        }
    }
}

@Composable
private fun StatTile(label: String, value: String) {
    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E5249)),
    ) {
        Column(modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp)) {
            Text(text = value, style = MaterialTheme.typography.titleLarge, color = Color.White, fontWeight = FontWeight.Bold)
            Text(text = label, style = MaterialTheme.typography.labelMedium, color = Color(0xFFD7EAE4))
        }
    }
}

@Composable
private fun CategoryChip(label: String) {
    Box(
        modifier = Modifier
            .border(1.dp, Color(0xFFB8CEC7), RoundedCornerShape(999.dp))
            .background(Color.White.copy(alpha = 0.72f), RoundedCornerShape(999.dp))
            .padding(horizontal = 12.dp, vertical = 8.dp),
    ) {
        Text(text = label, style = MaterialTheme.typography.labelLarge, color = Color(0xFF264D45))
    }
}

private data class HomeStats(
    val totalTrainings: Int,
    val bookedByUser: Int,
    val openSeats: Int,
) {
    companion object {
        fun from(trainings: List<Training>): HomeStats {
            return HomeStats(
                totalTrainings = trainings.size,
                bookedByUser = trainings.count(Training::isUserBooked),
                openSeats = trainings.filter { it.status == TrainingStatus.SCHEDULED }.sumOf(Training::availableSeats),
            )
        }
    }
}

private val TrainingCategory.displayName: String
    get() = when (this) {
        TrainingCategory.PILATES -> "Pilates"
        TrainingCategory.YOGA -> "Yoga"
        TrainingCategory.GROUP_TRAINING -> "Group Training"
    }

private val TrainingStatus.displayName: String
    get() = when (this) {
        TrainingStatus.SCHEDULED -> "Open"
        TrainingStatus.FULL -> "Full"
        TrainingStatus.CANCELLED -> "Cancelled"
        TrainingStatus.EXPIRED -> "Expired"
    }
