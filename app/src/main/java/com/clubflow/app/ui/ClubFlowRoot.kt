package com.clubflow.app.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.clubflow.app.ui.auth.AuthRoute
import com.clubflow.app.ui.auth.AuthViewModel
import com.clubflow.app.ui.home.HomeRoute
import com.clubflow.app.ui.home.HomeViewModel

@Composable
fun ClubFlowRoot() {
    val authViewModel: AuthViewModel = hiltViewModel()
    val homeViewModel: HomeViewModel = hiltViewModel()
    val authUiState by authViewModel.uiState.collectAsStateWithLifecycle()
    val session by authViewModel.sessionState.collectAsStateWithLifecycle()
    val homeUiState by homeViewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(session?.token) {
        if (session != null) {
            homeViewModel.refresh()
        }
    }

    if (session == null) {
        AuthRoute(
            uiState = authUiState,
            onModeChanged = authViewModel::setRegisterMode,
            onFullNameChanged = authViewModel::updateFullName,
            onPhoneChanged = authViewModel::updatePhone,
            onEmailChanged = authViewModel::updateEmail,
            onPasswordChanged = authViewModel::updatePassword,
            onSubmit = authViewModel::submit,
            onMessageShown = authViewModel::clearMessage,
        )
    } else {
        HomeRoute(
            uiState = homeUiState,
            onRefresh = homeViewModel::refresh,
            onBookTraining = homeViewModel::bookTraining,
            onCancelBooking = homeViewModel::cancelBooking,
            onLogout = authViewModel::logout,
            onMessageShown = homeViewModel::clearMessage,
        )
    }
}
