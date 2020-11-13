import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { ProjectService } from '../project/project.service';
import { EventService } from '../event/event.service';
import { SocketService } from '../socket/socket.service';
import { Project } from '../project/entities/project.entity';
import { Event } from '../event/entities/event.entity';
import {
  ConsultantConfirmedCashPaymentEvent,
  ConsultantRequestedReviewEvent,
  ConsultantRequestedToReleaseMilestoneEvent,
  ContractReadyEvent,
  CustomerCanceledSiteVisitEvent,
  CustomerReleasedMilestoneEvent,
  CustomerRequestedCashPaymentEvent,
  CustomerSignedContractEvent,
  CustomerRequestedSiteVisitScheduleChangeEvent,
  CustomerRescheduledSiteVisitEvent,
  EstimateStatusChangedEvent,
  EstimateUpdatedEvent,
  FinalProposalStatusChangedEvent,
  FinalProposalUpdateEvent,
  ProjectRegisteredEvent,
  ProjectUpdatedEvent,
  UserRegisteredEvent,
  SiteVisitScheduleUpdatedEvent,
  PickOutPaversScheduleUpdatedEvent,
  CustomerRequestedPickOutPaversScheduleChangeEvent,
  ContractorProfileUpdatedEvent,
  AdminApprovedBasicProfileEvent,
  AdminDeclinedOnboardingContractorEvent,
  ContractorSignedLegalTermsEvent,
  ContractorFinishedSettingUpStripeAccountEvent,
  ConsultantInvitedContractorToProjectEvent,
  ContractorAcceptedProjectEvent,
  ContractorDeclinedProjectEvent,
  ContractorFinishedProjectEvent,
  ContractorRequestedMilestoneReleaseEvent,
  AdminPaidSubContractMilestoneEvent,
  ContractorSetupPaymentEvent,
  SitePlanUpdatedEvent,
  ConsultantRequestedMilestoneReleaseEvent,
  CustomerRequestedFinancePaymentEvent,
  ConsultantConfirmedFinancePaymentEvent,
} from '../event/dtos/add-event.dto';
import { Estimate } from '../project/estimate/entities/estimate.entity';
import { User } from '../users/entities/user.entity';
import { FinalProposal } from '../project/final-proposal/entities/final-proposal.entity';
import { Milestone } from '../project/entities/milestone.entity';
import { SubContract } from '../project/sub-contract/entities/sub-contract.entity';

@Injectable()
export class NotificationService {

  constructor(
    private userService: UsersService,
    private projectService: ProjectService,
    private eventService: EventService,
    private socketService: SocketService,
  ) {
  }

  async projectUpdatedEvent(project: Project): Promise<Event> {
    const payload = new ProjectUpdatedEvent(project.customer.user, project);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async estimateUpdatedEvent(user: User, estimate: Estimate): Promise<Event> {
    const payload = new EstimateUpdatedEvent(user, estimate);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async finalProposalSetEvent(user: User, proposal: FinalProposal): Promise<Event> {
    const payload = new FinalProposalUpdateEvent(user, proposal);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async projectRegisteredEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new ProjectRegisteredEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async finalProposalStatusChangedEvent(users: User[], proposal: FinalProposal): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new FinalProposalStatusChangedEvent(user, proposal);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async estimateStatusChangedEvent(users: User[], estimate: Estimate): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new EstimateStatusChangedEvent(user, estimate);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async userRegisteredEvent(users: User[], newUser: User): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new UserRegisteredEvent(user, newUser);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async customerReleasedMilestoneEvent(users: User[], milestone: Milestone): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerReleasedMilestoneEvent(user, milestone);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async customerRequestedCashPaymentEvent(users: User[], milestone: Milestone): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerRequestedCashPaymentEvent(user, milestone);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async customerRequestedFinancePaymentEvent(users: User[], milestone: Milestone): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerRequestedFinancePaymentEvent(user, milestone);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async consultantRequestedToReleaseMilestoneEvent(user: User, milestone: Milestone): Promise<Event> {
    const payload = new ConsultantRequestedToReleaseMilestoneEvent(user, milestone);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async consultantConfirmedCashPaymentEvent(user: User, milestone: Milestone): Promise<Event> {
    const payload = new ConsultantConfirmedCashPaymentEvent(user, milestone);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async consultantConfirmedFinancePaymentEvent(user: User, milestone: Milestone): Promise<Event> {
    const payload = new ConsultantConfirmedFinancePaymentEvent(user, milestone);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async consultantRequestedReviewEvent(user: User, project: Project): Promise<Event> {
    const payload = new ConsultantRequestedReviewEvent(user, project);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async customerSignedContractEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerSignedContractEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async contractReadyEvent(user: User, project: Project): Promise<Event> {
    const payload = new ContractReadyEvent(user, project);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async customerAcceptedContractEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerSignedContractEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async customerRescheduledSiteVisitEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerRescheduledSiteVisitEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async customerCanceledSiteVisitEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerCanceledSiteVisitEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async siteVisitScheduleUpdatedEvent(user: User, project: Project): Promise<Event> {
    const payload = new SiteVisitScheduleUpdatedEvent(user, project);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async pickOutPaversScheduleUpdatedEvent(user: User, project: Project): Promise<Event> {
    const payload = new PickOutPaversScheduleUpdatedEvent(user, project);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async customerRequestedSiteVisitChangeEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerRequestedSiteVisitScheduleChangeEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async customerRequestedPickOutPaversChangeEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerRequestedPickOutPaversScheduleChangeEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  contractorUpdatedProfileEvent(users: User[], contractorUser: User): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new ContractorProfileUpdatedEvent(user, contractorUser);
      const event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async adminApprovedBasicProfileEvent(user: User): Promise<Event> {
    const payload = new AdminApprovedBasicProfileEvent(user);
    const event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async adminDeclinedOnboardingContractorEvent(user: User): Promise<Event> {
    const payload = new AdminDeclinedOnboardingContractorEvent(user);
    const event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  contractorSignedLegalTermsEvent(users: User[], contractorUser: User): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new ContractorSignedLegalTermsEvent(user, contractorUser);
      const event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  contractorSetupPaymentEvent(users: User[], contractorUser: User): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new ContractorSetupPaymentEvent(user, contractorUser);
      const event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  contractorFinishedSettingUpStripeAccountEvent(users: User[], contractorUser: User): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new ContractorFinishedSettingUpStripeAccountEvent(user, contractorUser);
      const event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async consultantInvitedContractorToProjectEvent(user: User, project: Project): Promise<Event> {
    const payload = new ConsultantInvitedContractorToProjectEvent(user, project);
    const event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async sitePlanUpdatedEvent(user: User, project: Project): Promise<Event> {
    const payload = new SitePlanUpdatedEvent(user, project);
    const event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  contractorAcceptedProjectEvent(users: User[], contractorUser: User, project: Project, subContract: SubContract): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new ContractorAcceptedProjectEvent(user, contractorUser, project, subContract);
      const event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  contractorDeclinedProjectEvent(users: User[], contractorUser: User, project: Project, subContract: SubContract): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new ContractorDeclinedProjectEvent(user, contractorUser, project, subContract);
      const event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  contractorFinishedProjectEvent(users: User[], contractorUser: User, project: Project, subContract: SubContract): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new ContractorFinishedProjectEvent(user, contractorUser, project, subContract);
      const event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  contractorRequestedMilestoneReleaseEvent(users: User[], contractorUser: User, project: Project, subContract: SubContract): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new ContractorRequestedMilestoneReleaseEvent(user, contractorUser, project, subContract);
      const event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  consultantRequestedMilestoneReleaseEvent(users: User[], consultantUser: User, project: Project, subContract: SubContract): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new ConsultantRequestedMilestoneReleaseEvent(user, project, subContract);
      const event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async adminPaidSubContractMilestoneEvent(user: User, project: Project): Promise<Event> {
    const payload = new AdminPaidSubContractMilestoneEvent(user, project);
    const event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }
}
